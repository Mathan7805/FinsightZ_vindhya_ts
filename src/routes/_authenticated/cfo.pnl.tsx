import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, FileSpreadsheet, Receipt, CheckCircle2, History, Download, ArrowDown, ArrowUp } from "lucide-react";
import { AppShell, PageHeader, StatCard } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/cfo/pnl")({
  head: () => ({ meta: [{ title: "P&L Review — FInsightZ" }] }),
  component: PnLReview,
});

const nav = [
  { label: "Overview", href: "/cfo", icon: LayoutDashboard },
  { label: "P&L Review", href: "/cfo/pnl", icon: FileSpreadsheet },
  { label: "Invoices", href: "/cfo/invoices", icon: Receipt },
  { label: "Approvals", href: "/cfo/approvals", icon: CheckCircle2 },
  { label: "Audit Log", href: "/cfo/audit", icon: History },
];

type Row = { label: string; cur: number; prev: number; bold?: boolean; sub?: boolean; section?: boolean };

const lines: Row[] = [
  { label: "Revenue from Operations", cur: 564.0, prev: 530.0 },
  { label: "PRI Reimbursement", cur: 12.0, prev: 10.5 },
  { label: "Incentives", cur: 8.4, prev: 7.1 },
  { label: "Revenue Variations", cur: -3.4, prev: -1.6 },
  { label: "A. Total Revenue", cur: 581.0, prev: 546.0, bold: true },
  { label: "B. COSR – Fixed Costs", cur: 78.4, prev: 76.1, section: true },
  { label: "Rent", cur: 22.1, prev: 21.8, sub: true },
  { label: "Electricity", cur: 14.3, prev: 13.9, sub: true },
  { label: "Water · Diesel · Server Rental", cur: 42.0, prev: 40.4, sub: true },
  { label: "C. Variable Costs", cur: 64.1, prev: 60.4, section: true },
  { label: "Software · Telephone · Infra util.", cur: 64.1, prev: 60.4, sub: true },
  { label: "D. Manpower Costs", cur: 256.0, prev: 241.0, section: true },
  { label: "CTC, Incentives, Outsourcing, Welfare, Travel, Gratuity", cur: 256.0, prev: 241.0, sub: true },
  { label: "G. Gross Margin (A − B)", cur: 502.6, prev: 469.9, bold: true },
  { label: "H. Operating Profit (A − B − C − D)", cur: 182.5, prev: 168.5, bold: true },
  { label: "E. Overheads", cur: 38.6, prev: 36.2, section: true },
  { label: "F. Financial Costs · Depreciation", cur: 19.9, prev: 18.5, section: true },
  { label: "I. Net Profit (H − E − F)", cur: 124.0, prev: 113.8, bold: true },
];

function fmt(n: number) {
  return `${n < 0 ? "-" : ""}₹${Math.abs(n).toFixed(1)}M`;
}

function PnLReview() {
  return (
    <AppShell nav={nav}>
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <PageHeader
          eyebrow="CFO · P&L"
          title="Master P&L — November 2025"
          subtitle="Layered profit & loss derived from finance, operations, IT and facilities uploads. Variances are vs October 2025."
          actions={
            <>
              <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export Excel</Button>
              <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export PDF</Button>
              <Button className="bg-[var(--gradient-emerald)] text-primary-foreground shadow-glow">Send for approval</Button>
            </>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Revenue" value="₹581M" delta="+6.4% MoM" accent="emerald" />
          <StatCard label="Gross Margin" value="86.5%" delta="+0.5 pts" />
          <StatCard label="Operating Profit" value="₹182.5M" delta="+8.3%" accent="gold" />
          <StatCard label="Net Profit" value="₹124M" delta="+9.0%" />
        </div>

        <div className="glass rounded-2xl overflow-hidden shadow-elevated">
          <table className="w-full text-sm">
            <thead className="bg-card/40">
              <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground">
                <th className="px-6 py-3">Line item</th>
                <th className="text-right">Nov 2025</th>
                <th className="text-right">Oct 2025</th>
                <th className="text-right pr-6">Δ MoM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {lines.map((r) => {
                const delta = r.cur - r.prev;
                const pct = (delta / r.prev) * 100;
                const up = delta >= 0;
                return (
                  <tr key={r.label} className={r.section ? "bg-card/20" : ""}>
                    <td className={`px-6 py-3 ${r.bold ? "font-semibold text-foreground" : r.sub ? "pl-12 text-muted-foreground" : ""}`}>
                      {r.label}
                    </td>
                    <td className={`text-right tabular-nums ${r.bold ? "font-semibold" : ""}`}>{fmt(r.cur)}</td>
                    <td className="text-right tabular-nums text-muted-foreground">{fmt(r.prev)}</td>
                    <td className="text-right pr-6">
                      <Badge variant="outline" className={up ? "border-success/40 text-success" : "border-destructive/40 text-destructive"}>
                        {up ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                        {pct.toFixed(1)}%
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="glass rounded-2xl p-6 shadow-elevated">
            <h3 className="font-display font-semibold text-lg mb-4">Per-FTE ratios</h3>
            <div className="space-y-3 text-sm">
              {[
                ["Revenue / FTE", "₹0.42M", "+2.1%"],
                ["Gross Margin / FTE", "₹0.36M", "+1.6%"],
                ["Cost / FTE", "₹0.27M", "-0.8%"],
                ["COSR / Total Cost", "21.4%", "-0.3 pts"],
              ].map(([k, v, d]) => (
                <div key={k as string} className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0">
                  <span className="text-muted-foreground">{k}</span>
                  <div className="text-right">
                    <div className="font-semibold">{v}</div>
                    <div className="text-xs text-success">{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-6 shadow-elevated">
            <h3 className="font-display font-semibold text-lg mb-4">Drill-down views</h3>
            <div className="space-y-2">
              {["Process-wise P&L", "Customer-wise P&L", "Site-wise P&L", "Segment-wise P&L"].map((d) => (
                <Button key={d} variant="outline" className="w-full justify-between">
                  {d} <ArrowDown className="w-3 h-3 -rotate-90" />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
