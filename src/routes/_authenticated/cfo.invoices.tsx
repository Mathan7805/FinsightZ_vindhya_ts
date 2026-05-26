import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Receipt, LayoutDashboard, FileSpreadsheet, CheckCircle2, History, FolderOpen, RefreshCw, Loader2, BarChart3, FileUp, ScanLine, FileCheck2, FileText } from "lucide-react";
import { AppShell, PageHeader, StatCard } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useServerFn } from "@tanstack/react-start";
import { extractInvoice } from "@/lib/invoice-extract.functions";
import * as XLSX from "xlsx";

export const Route = createFileRoute("/_authenticated/cfo/invoices")({
  head: () => ({ meta: [{ title: "Invoices — FInsightZ" }] }),
  component: CFOInvoices,
});

const nav = [
  { label: "Overview", href: "/cfo", icon: LayoutDashboard },
  { label: "P&L Review", href: "/cfo/pnl", icon: FileSpreadsheet },
  { label: "Profitability", href: "/cfo/profitability", icon: BarChart3 },
  { label: "Invoices", href: "/cfo/invoices", icon: Receipt },
  { label: "Approvals", href: "/cfo/approvals", icon: CheckCircle2 },
  { label: "Audit Log", href: "/cfo/audit", icon: History },
];

type Kind = "client_issued" | "client_billing" | "vendor_received";

type Row = {
  id: string;
  filename: string;
  status: "queued" | "scanning" | "extracted" | "error";
  error?: string;
  fields: {
    invoice_number?: string;
    invoice_date?: string;
    party_name?: string;
    party_gstin?: string;
    currency?: string;
    amount?: number;
    taxable_amount?: number;
    gst_amount?: number;
    status?: string;
    cost_center?: string;
    line_summary?: string;
  };
};

const FOLDERS: { key: Kind; title: string; subtitle: string; defaultPath: string; accept: string; icon: any; tone: string }[] = [
  {
    key: "client_issued",
    title: "Client invoices · raised by us",
    subtitle: "Invoices our company has already raised for clients — drop the issued PDFs or point to the AR-Issued folder.",
    defaultPath: "OneDrive · /Finance/AR/Issued/2026",
    accept: "application/pdf,image/*",
    icon: FileCheck2,
    tone: "emerald",
  },
  {
    key: "client_billing",
    title: "Client billing sheets · unbilled / contracted",
    subtitle: "For clients not yet billed — drop the billing Excel/CSV (process codes, rates, volumes). FInsightZ will line-extract per row.",
    defaultPath: "SharePoint · /Finance/AR/Unbilled-Inputs",
    accept: ".xlsx,.xls,.csv,application/pdf,image/*",
    icon: FileUp,
    tone: "gold",
  },
  {
    key: "vendor_received",
    title: "Vendor invoices · raised on us",
    subtitle: "AP inbox — vendor PDFs and scans. AI extracts vendor, GSTIN, amount, GST, due date.",
    defaultPath: "SharePoint · /Finance/AP/Inbox/2026",
    accept: "application/pdf,image/*,.xlsx,.csv",
    icon: FileText,
    tone: "primary",
  },
];

function fileToBase64(f: File): Promise<{ mime: string; b64: string }> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(r.error);
    r.onload = () => {
      const str = String(r.result || "");
      const comma = str.indexOf(",");
      resolve({ mime: f.type || "application/octet-stream", b64: comma >= 0 ? str.slice(comma + 1) : str });
    };
    r.readAsDataURL(f);
  });
}

async function parseExcelRows(f: File): Promise<Row[]> {
  const buf = await f.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, any>>(ws, { defval: null });
  const find = (r: Record<string, any>, keys: string[]) => {
    for (const k of Object.keys(r)) {
      const n = k.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (keys.some((q) => n.includes(q))) return r[k];
    }
    return undefined;
  };
  return rows.slice(0, 200).map((r, i) => ({
    id: `${f.name}#${i}`,
    filename: `${f.name} · row ${i + 1}`,
    status: "extracted" as const,
    fields: {
      invoice_number: find(r, ["invoiceno", "billno", "invno"])?.toString(),
      invoice_date: find(r, ["date", "billdate"])?.toString(),
      party_name: find(r, ["client", "customer", "vendor", "party", "name"])?.toString(),
      party_gstin: find(r, ["gstin", "gstno"])?.toString(),
      amount: Number(find(r, ["amount", "total", "value", "grandtotal"]) ?? 0) || undefined,
      taxable_amount: Number(find(r, ["taxable", "basic", "subtotal"]) ?? 0) || undefined,
      gst_amount: Number(find(r, ["gst", "tax"]) ?? 0) || undefined,
      status: find(r, ["status"])?.toString(),
      cost_center: find(r, ["process", "costcenter", "project"])?.toString(),
      line_summary: find(r, ["description", "service", "particulars", "narration"])?.toString(),
    },
  }));
}

function fmtAmt(n?: number) {
  if (n == null || !Number.isFinite(n)) return "—";
  return `₹${new Intl.NumberFormat("en-IN").format(Math.round(n))}`;
}

function statusBadge(s?: string) {
  if (!s) return null;
  const n = s.toLowerCase();
  const cls = /paid|billed|posted/.test(n)
    ? "border-success/40 text-success"
    : /unbilled|unpaid|pending|overdue/.test(n)
    ? "border-warning/40 text-warning"
    : "border-border text-muted-foreground";
  return <Badge variant="outline" className={cls}>{s}</Badge>;
}

function FolderZone({ cfg, rows, setRows }: { cfg: typeof FOLDERS[number]; rows: Row[]; setRows: (r: Row[]) => void }) {
  const [path, setPath] = useState(cfg.defaultPath);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const extract = useServerFn(extractInvoice);
  const Icon = cfg.icon;

  const onFiles = async (files: File[]) => {
    if (!files.length) return;
    setError(null); setScanning(true);
    const initial: Row[] = files.map((f) => ({ id: `${cfg.key}-${f.name}-${f.size}-${Math.random().toString(36).slice(2, 6)}`, filename: f.name, status: "scanning" as const, fields: {} }));
    setRows([...initial, ...rows]);

    const updated: Row[] = [...initial];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      try {
        if (/\.(xlsx|xls|csv)$/i.test(f.name)) {
          const extracted = await parseExcelRows(f);
          updated.splice(i, 1, ...extracted);
        } else {
          const { mime, b64 } = await fileToBase64(f);
          const out = await extract({ data: { filename: f.name, mime, dataBase64: b64, kind: cfg.key } });
          updated[i] = { ...updated[i], status: out.ok ? "extracted" : "error", fields: out.fields ?? {}, error: out.ok ? undefined : "AI returned no fields" };
        }
      } catch (e: any) {
        updated[i] = { ...updated[i], status: "error", error: e?.message ?? "Failed" };
      }
      setRows([...updated, ...rows]);
    }
    setScanning(false);
  };

  return (
    <div className="glass rounded-2xl shadow-elevated">
      <div className="p-5 border-b border-border/60 flex flex-wrap items-start gap-4 justify-between">
        <div className="flex gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl bg-${cfg.tone}/15 grid place-items-center shrink-0`}>
            <Icon className={`w-5 h-5 text-${cfg.tone}`} />
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-base">{cfg.title}</h3>
            <p className="text-xs text-muted-foreground max-w-xl">{cfg.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary/40 text-primary">{rows.length} extracted</Badge>
        </div>
      </div>

      <div className="p-5 grid md:grid-cols-[1fr_auto_auto] gap-3 items-end border-b border-border/60">
        <div>
          <label className="text-[11px] uppercase tracking-widest text-muted-foreground">Monitored folder</label>
          <Input value={path} onChange={(e) => setPath(e.target.value)} placeholder="OneDrive / SharePoint / Drive path" className="mt-1" />
        </div>
        <input ref={inputRef} type="file" multiple accept={cfg.accept} className="hidden"
          onChange={(e) => { const fs = Array.from(e.target.files ?? []); e.target.value = ""; onFiles(fs); }} />
        <Button variant="outline" onClick={() => inputRef.current?.click()} disabled={scanning}>
          <FolderOpen className="w-4 h-4 mr-2" /> Choose files
        </Button>
        <Button onClick={() => inputRef.current?.click()} disabled={scanning}
          className="bg-[var(--gradient-emerald)] text-primary-foreground shadow-glow">
          {scanning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ScanLine className="w-4 h-4 mr-2" />}
          Scan new files
        </Button>
      </div>

      {error && <div className="mx-5 my-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</div>}

      <div className="overflow-auto max-h-[420px]">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-card z-10">
            <tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/60">
              <th className="px-4 py-2">File / Source</th>
              <th className="px-3 py-2">Invoice #</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">{cfg.key === "vendor_received" ? "Vendor" : "Client"}</th>
              <th className="px-3 py-2">GSTIN</th>
              <th className="px-3 py-2 text-right">Taxable</th>
              <th className="px-3 py-2 text-right">GST</th>
              <th className="px-3 py-2 text-right">Total</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {rows.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">
                No invoices ingested yet — choose files above to let AI extract them.
              </td></tr>
            ) : rows.map((r) => (
              <tr key={r.id} className="hover:bg-card/30">
                <td className="px-4 py-2 max-w-[260px] truncate">
                  <div className="truncate">{r.filename}</div>
                  {r.status === "scanning" && <div className="text-[10px] text-muted-foreground flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> AI extracting…</div>}
                  {r.status === "error" && <div className="text-[10px] text-destructive">{r.error}</div>}
                </td>
                <td className="px-3 py-2 font-mono">{r.fields.invoice_number ?? "—"}</td>
                <td className="px-3 py-2">{r.fields.invoice_date ?? "—"}</td>
                <td className="px-3 py-2">{r.fields.party_name ?? "—"}</td>
                <td className="px-3 py-2 font-mono text-[10px]">{r.fields.party_gstin ?? "—"}</td>
                <td className="px-3 py-2 text-right tabular-nums">{fmtAmt(r.fields.taxable_amount)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{fmtAmt(r.fields.gst_amount)}</td>
                <td className="px-3 py-2 text-right tabular-nums font-semibold">{fmtAmt(r.fields.amount)}</td>
                <td className="px-3 py-2">{statusBadge(r.fields.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CFOInvoices() {
  const [issued, setIssued] = useState<Row[]>([]);
  const [billing, setBilling] = useState<Row[]>([]);
  const [vendor, setVendor] = useState<Row[]>([]);

  const totals = (rs: Row[]) => rs.reduce((s, r) => s + (Number(r.fields.amount) || 0), 0);

  return (
    <AppShell nav={nav}>
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <PageHeader
          eyebrow="CFO · Invoices"
          title="Invoice Intelligence"
          subtitle="Point FInsightZ at your client-issued, client-billing and vendor folders. AI scans new files and extracts fields into three live tables."
          actions={
            <Button variant="outline" onClick={() => { setIssued([]); setBilling([]); setVendor([]); }}>
              <RefreshCw className="w-4 h-4 mr-2" /> Reset
            </Button>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="AR · Client invoices raised" value={fmtAmt(totals(issued))} accent="emerald" />
          <StatCard label="AR · Billing inputs (unbilled)" value={fmtAmt(totals(billing))} accent="gold" />
          <StatCard label="AP · Vendor invoices received" value={fmtAmt(totals(vendor))} />
          <StatCard label="Documents extracted" value={String(issued.length + billing.length + vendor.length)} />
        </div>

        <div className="grid gap-6">
          <FolderZone cfg={FOLDERS[0]} rows={issued} setRows={setIssued} />
          <FolderZone cfg={FOLDERS[1]} rows={billing} setRows={setBilling} />
          <FolderZone cfg={FOLDERS[2]} rows={vendor} setRows={setVendor} />
        </div>
      </div>
    </AppShell>
  );
}
