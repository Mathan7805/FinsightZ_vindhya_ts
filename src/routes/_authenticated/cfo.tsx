import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, FileSpreadsheet, Receipt, CheckCircle2, History, Upload, Eye } from "lucide-react";
import { AppShell, PageHeader, StatCard } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/_authenticated/cfo")({
  head: () => ({ meta: [{ title: "CFO Dashboard — FInsightZ" }] }),
  component: CFODashboard,
});

const nav = [
  { label: "Overview", href: "/cfo", icon: LayoutDashboard },
  { label: "P&L Review", href: "/cfo", icon: FileSpreadsheet },
  { label: "Invoices", href: "/cfo", icon: Receipt },
  { label: "Approvals", href: "/cfo", icon: CheckCircle2 },
  { label: "Audit Log", href: "/cfo", icon: History },
];

const revenue = [
  { m: "Jun", revenue: 420, cost: 310 },
  { m: "Jul", revenue: 465, cost: 322 },
  { m: "Aug", revenue: 488, cost: 335 },
  { m: "Sep", revenue: 512, cost: 351 },
  { m: "Oct", revenue: 548, cost: 362 },
  { m: "Nov", revenue: 581, cost: 378 },
];

const process = [
  { p: "Voice Ops", margin: 28 },
  { p: "Back Office", margin: 34 },
  { p: "Collections", margin: 22 },
  { p: "Tech Support", margin: 41 },
  { p: "Chat", margin: 18 },
];

function CFODashboard() {
  return (
    <AppShell nav={nav}>
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <PageHeader
          eyebrow="CFO Workspace"
          title="Profitability Command Center"
          subtitle="Review consolidated P&L, validate process-level margins, and publish the monthly book once numbers are frozen."
          actions={
            <>
              <Button variant="outline"><Eye className="w-4 h-4 mr-2" /> Draft view</Button>
              <Button className="bg-[var(--gradient-emerald)] text-primary-foreground shadow-glow">
                Publish November
              </Button>
            </>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Revenue" value="₹581M" delta="+5.7% MoM" accent="emerald" />
          <StatCard label="Gross Margin" value="34.9%" delta="+1.2 pts" />
          <StatCard label="Operating Profit" value="₹128M" delta="+8.3%" accent="gold" />
          <StatCard label="Net Profit" value="₹94M" delta="+6.1%" />
          <StatCard label="DSO" value="42 days" delta="-3 days" />
          <StatCard label="Revenue / FTE" value="₹0.42M" delta="+2.1%" />
          <StatCard label="Cost / FTE" value="₹0.27M" delta="-0.8%" />
          <StatCard label="Seat Utilization" value="87%" delta="+4 pts" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 glass rounded-2xl p-6 shadow-elevated">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold text-lg">Revenue vs Cost</h3>
                <p className="text-xs text-muted-foreground">Trailing 6 months · ₹ millions</p>
              </div>
              <Badge variant="outline" className="border-primary/40 text-primary">Live</Badge>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenue}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.16 162)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.72 0.16 162)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="cst" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.13 85)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.78 0.13 85)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0.03 165 / 40%)" />
                <XAxis dataKey="m" stroke="oklch(0.72 0.02 150)" fontSize={12} />
                <YAxis stroke="oklch(0.72 0.02 150)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.035 165)", border: "1px solid oklch(0.32 0.03 165)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="oklch(0.72 0.16 162)" fill="url(#rev)" strokeWidth={2} />
                <Area type="monotone" dataKey="cost" stroke="oklch(0.78 0.13 85)" fill="url(#cst)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-2xl p-6 shadow-elevated">
            <h3 className="font-display font-semibold text-lg mb-1">Process Margin %</h3>
            <p className="text-xs text-muted-foreground mb-4">November snapshot</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={process} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0.03 165 / 40%)" horizontal={false} />
                <XAxis type="number" stroke="oklch(0.72 0.02 150)" fontSize={12} />
                <YAxis dataKey="p" type="category" stroke="oklch(0.72 0.02 150)" fontSize={12} width={90} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.035 165)", border: "1px solid oklch(0.32 0.03 165)", borderRadius: 12 }} />
                <Bar dataKey="margin" fill="oklch(0.72 0.16 162)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6 shadow-elevated">
            <h3 className="font-display font-semibold text-lg mb-4">Pending CFO Approvals</h3>
            <div className="space-y-3">
              {[
                { t: "November Master P&L", who: "Finance Team", tag: "Ready" },
                { t: "Vendor invoice batch #482", who: "AI Extracted · 14 docs", tag: "Review" },
                { t: "Q3 cost allocation rerun", who: "Operations Head", tag: "Pending" },
              ].map((i) => (
                <div key={i.t} className="flex items-center justify-between rounded-xl border border-border bg-card/30 px-4 py-3">
                  <div>
                    <div className="text-sm font-medium">{i.t}</div>
                    <div className="text-xs text-muted-foreground">{i.who}</div>
                  </div>
                  <Badge variant="outline" className="border-primary/40 text-primary">{i.tag}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-6 shadow-elevated">
            <h3 className="font-display font-semibold text-lg mb-4">Recent Publish Activity</h3>
            <div className="space-y-3 text-sm">
              {[
                ["Oct 2025 book frozen", "by Priya · 12 days ago"],
                ["Sept rev. adjustment v2", "by Arjun · 1 month ago"],
                ["Sept 2025 published", "by you · 1 month ago"],
              ].map(([t, m]) => (
                <div key={t} className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0">
                  <span>{t}</span>
                  <span className="text-xs text-muted-foreground">{m}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4 w-full"><Upload className="w-4 h-4 mr-2" /> Upload finance master</Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
