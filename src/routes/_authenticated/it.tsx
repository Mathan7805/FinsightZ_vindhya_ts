import { createFileRoute } from "@tanstack/react-router";
import { Server, Monitor, Cloud, Upload, Cpu, HardDrive } from "lucide-react";
import { AppShell, PageHeader, StatCard } from "@/components/AppShell";
import { UploadCenter } from "@/components/UploadCenter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/_authenticated/it")({
  head: () => ({ meta: [{ title: "IT Head Dashboard — FInsightZ" }] }),
  component: ITDashboard,
});

const nav = [
  { label: "Infra Costs", href: "/it", icon: Server },
  { label: "Seat Utilization", href: "/it", icon: Monitor },
  { label: "Software Stack", href: "/it", icon: Cloud },
  { label: "Device Mapping", href: "/it", icon: HardDrive },
  { label: "System Health", href: "/it", icon: Cpu },
];

const utilization = [
  { p: "Voice", seat: 92, sys: 78 },
  { p: "Back Off.", seat: 81, sys: 64 },
  { p: "Coll.", seat: 88, sys: 71 },
  { p: "Tech", seat: 95, sys: 86 },
  { p: "Chat", seat: 76, sys: 58 },
];

function ITDashboard() {
  return (
    <AppShell nav={nav}>
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <PageHeader
          eyebrow="IT / Admin Workspace"
          title="Infrastructure & Utilization"
          subtitle="Maintain infra cost allocations, seat / system utilization, and software subscription posture across processes."
          actions={
            <Button className="bg-[var(--gradient-emerald)] text-primary-foreground shadow-glow">
              <Upload className="w-4 h-4 mr-2" /> Upload utilization sheet
            </Button>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Monthly Infra Spend" value="₹38.2M" delta="-2.1% MoM" accent="emerald" />
          <StatCard label="Seats Occupied" value="1,842 / 2,120" delta="87% utilized" />
          <StatCard label="System Utilization" value="71%" delta="+3 pts" />
          <StatCard label="Active SaaS Tools" value="46" delta="3 expiring" accent="gold" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 glass rounded-2xl p-6 shadow-elevated">
            <h3 className="font-display font-semibold text-lg mb-1">Utilization by Process</h3>
            <p className="text-xs text-muted-foreground mb-4">Seat vs system utilization (%)</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={utilization}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0.03 165 / 40%)" />
                <XAxis dataKey="p" stroke="oklch(0.72 0.02 150)" fontSize={12} />
                <YAxis stroke="oklch(0.72 0.02 150)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.035 165)", border: "1px solid oklch(0.32 0.03 165)", borderRadius: 12 }} />
                <Bar dataKey="seat" fill="oklch(0.72 0.16 162)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="sys" fill="oklch(0.78 0.13 85)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-2xl p-6 shadow-elevated">
            <h3 className="font-display font-semibold text-lg mb-4">Software Subscriptions</h3>
            <div className="space-y-4">
              {[
                { n: "Dialer Pro", v: "₹6.4M / yr", u: 92 },
                { n: "Salesforce CRM", v: "₹4.8M / yr", u: 78 },
                { n: "AWS Cloud", v: "₹12.1M / yr", u: 84 },
                { n: "MS 365", v: "₹2.2M / yr", u: 95 },
              ].map((s) => (
                <div key={s.n}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{s.n}</span>
                    <span className="text-muted-foreground">{s.v}</span>
                  </div>
                  <Progress value={s.u} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 shadow-elevated">
          <h3 className="font-display font-semibold text-lg mb-4">Infrastructure Allocations</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { l: "Building Rent", v: "₹14.8M", s: "allocated to 5 processes" },
              { l: "Server Rental", v: "₹6.2M", s: "12 server racks" },
              { l: "Internet Charges", v: "₹2.1M", s: "dual ISP" },
              { l: "Electricity", v: "₹4.6M", s: "metered allocation" },
            ].map((i) => (
              <div key={i.l} className="rounded-xl border border-border bg-card/30 p-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{i.l}</div>
                <div className="text-2xl font-display font-bold mt-1">{i.v}</div>
                <div className="text-xs text-muted-foreground mt-1">{i.s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
