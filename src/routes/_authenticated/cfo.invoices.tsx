import { createFileRoute } from "@tanstack/react-router";
import { Receipt, LayoutDashboard, FileSpreadsheet, CheckCircle2, History, FolderOpen, RefreshCw } from "lucide-react";
import { AppShell, PageHeader, StatCard } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/_authenticated/cfo/invoices")({
  head: () => ({ meta: [{ title: "Invoices — FInsightZ" }] }),
  component: CFOInvoices,
});

const nav = [
  { label: "Overview", href: "/cfo", icon: LayoutDashboard },
  { label: "P&L Review", href: "/cfo/pnl", icon: FileSpreadsheet },
  { label: "Invoices", href: "/cfo/invoices", icon: Receipt },
  { label: "Approvals", href: "/cfo/approvals", icon: CheckCircle2 },
  { label: "Audit Log", href: "/cfo/audit", icon: History },
];

const categoryMix = [
  { c: "Building", v: 22.1 },
  { c: "IT", v: 18.6 },
  { c: "HR", v: 12.4 },
  { c: "Travel", v: 4.2 },
  { c: "Professional", v: 6.8 },
  { c: "Telecom", v: 3.9 },
];

const folders = [
  { name: "Client Invoices · OneDrive/2025/Clients", scanned: 312, new: 14, status: "Live" },
  { name: "Vendor Invoices · SharePoint/AP/Inbox", scanned: 489, new: 22, status: "Live" },
  { name: "E-Invoices · GSTN feed", scanned: 124, new: 3, status: "Live" },
  { name: "Credit Notes · /finance/cn/2025", scanned: 41, new: 1, status: "Paused" },
];

function CFOInvoices() {
  return (
    <AppShell nav={nav}>
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <PageHeader
          eyebrow="CFO · Invoices"
          title="Invoice Intelligence"
          subtitle="Monitored client and vendor folders, AI classification mix, and posting status across the month."
          actions={
            <>
              <Button variant="outline"><RefreshCw className="w-4 h-4 mr-2" /> Rescan folders</Button>
              <Button className="bg-[var(--gradient-emerald)] text-primary-foreground shadow-glow">
                <FolderOpen className="w-4 h-4 mr-2" /> Add folder
              </Button>
            </>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Invoices ingested (Nov)" value="966" delta="+12% MoM" accent="emerald" />
          <StatCard label="Auto-classified" value="91%" delta="+3 pts" />
          <StatCard label="Avg AI confidence" value="0.93" />
          <StatCard label="Posted to GL" value="₹412M" accent="gold" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 glass rounded-2xl p-6 shadow-elevated">
            <h3 className="font-display font-semibold text-lg mb-1">Cost classification mix</h3>
            <p className="text-xs text-muted-foreground mb-4">November · ₹ millions, AI-routed buckets</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryMix}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0.03 165 / 40%)" />
                <XAxis dataKey="c" stroke="oklch(0.72 0.02 150)" fontSize={12} />
                <YAxis stroke="oklch(0.72 0.02 150)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.035 165)", border: "1px solid oklch(0.32 0.03 165)", borderRadius: 12 }} />
                <Bar dataKey="v" fill="oklch(0.72 0.16 162)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-2xl p-6 shadow-elevated">
            <h3 className="font-display font-semibold text-lg mb-4">Extraction confidence</h3>
            <div className="space-y-4 text-sm">
              {[
                ["Invoice number", 0.99],
                ["Date", 0.98],
                ["Amount / GST", 0.93],
                ["Process / Cost center", 0.82],
                ["Vendor name", 0.95],
                ["Payment terms", 0.79],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <div className="flex items-center justify-between mb-1">
                    <span>{k}</span>
                    <span className="text-xs text-muted-foreground">{Math.round((v as number) * 100)}%</span>
                  </div>
                  <Progress value={(v as number) * 100} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 shadow-elevated">
          <h3 className="font-display font-semibold text-lg mb-4">Monitored folders</h3>
          <div className="space-y-3">
            {folders.map((f) => (
              <div key={f.name} className="flex items-center justify-between rounded-xl border border-border bg-card/30 px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <FolderOpen className="w-4 h-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{f.name}</div>
                    <div className="text-xs text-muted-foreground">{f.scanned} scanned · {f.new} new today</div>
                  </div>
                </div>
                <Badge variant="outline" className={f.status === "Live" ? "border-success/40 text-success" : "border-warning/40 text-warning"}>
                  {f.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
