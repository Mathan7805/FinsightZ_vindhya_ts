import { createFileRoute } from "@tanstack/react-router";
import { Activity, Users, Target, Upload, TrendingUp } from "lucide-react";
import { AppShell, PageHeader, StatCard } from "@/components/AppShell";
import { UploadCenter } from "@/components/UploadCenter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/_authenticated/operations/")({
  head: () => ({ meta: [{ title: "Operations Dashboard — FInsightZ" }] }),
  component: OpsDashboard,
});

import { opsNav as nav } from "./operations";

const trend = Array.from({ length: 14 }, (_, i) => ({
  d: `D${i + 1}`,
  revPerFte: 4200 + Math.round(Math.sin(i / 2) * 180 + Math.random() * 80),
  costPerFte: 2680 + Math.round(Math.cos(i / 2) * 90 + Math.random() * 40),
}));

function OpsDashboard() {
  return (
    <AppShell nav={nav}>
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <PageHeader
          eyebrow="Operations Workspace"
          title="Process Operating Metrics"
          subtitle="Push process-wise headcount, productivity and SLA data — the allocation engine consumes it for profitability."
          actions={
            <Button className="bg-[var(--gradient-emerald)] text-primary-foreground shadow-glow">
              <Upload className="w-4 h-4 mr-2" /> Upload process metrics
            </Button>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total FTE" value="2,418" delta="+62 MoM" accent="emerald" />
          <StatCard label="Billable FTE" value="2,184" delta="90.3%" />
          <StatCard label="Avg SLA" value="92.7%" delta="+1.4 pts" accent="gold" />
          <StatCard label="Avg AHT" value="324s" delta="-12s" />
        </div>

        <div className="mb-8">
          <UploadCenter persona="operations" title="Operations Upload & AI Reader"
            subtitle="Drop productivity sheets, headcount reconciliations, shift rosters — AI maps process codes, FTE and SLA fields automatically." />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 glass rounded-2xl p-6 shadow-elevated">
            <h3 className="font-display font-semibold text-lg mb-1">14-day Performance Trend</h3>
            <p className="text-xs text-muted-foreground mb-4">AHT (seconds) and SLA (%)</p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0.03 165 / 40%)" />
                <XAxis dataKey="d" stroke="oklch(0.72 0.02 150)" fontSize={12} />
                <YAxis stroke="oklch(0.72 0.02 150)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.035 165)", border: "1px solid oklch(0.32 0.03 165)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="aht" stroke="oklch(0.78 0.13 85)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="sla" stroke="oklch(0.72 0.16 162)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-2xl p-6 shadow-elevated">
            <h3 className="font-display font-semibold text-lg mb-4">Top Processes by Headcount</h3>
            <div className="space-y-3">
              {[
                ["Voice Ops", 842, "ahead"],
                ["Back Office", 624, "ontrack"],
                ["Collections", 412, "behind"],
                ["Tech Support", 318, "ahead"],
                ["Chat", 222, "ontrack"],
              ].map(([n, c, s]) => (
                <div key={n as string} className="flex items-center justify-between rounded-xl border border-border bg-card/30 px-4 py-3">
                  <div>
                    <div className="text-sm font-medium">{n}</div>
                    <div className="text-xs text-muted-foreground">{c} FTE</div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      s === "ahead"
                        ? "border-success/40 text-success"
                        : s === "behind"
                        ? "border-destructive/40 text-destructive"
                        : "border-primary/40 text-primary"
                    }
                  >
                    {s}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 shadow-elevated">
          <h3 className="font-display font-semibold text-lg mb-4">Pending Uploads</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { t: "Nov Productivity Sheet", due: "Due Dec 02" },
              { t: "Nov Headcount Reconciliation", due: "Due Dec 03" },
              { t: "Nov Shift Roster", due: "Due Dec 05" },
            ].map((u) => (
              <div key={u.t} className="rounded-xl border border-border bg-card/30 p-4">
                <div className="text-sm font-medium">{u.t}</div>
                <div className="text-xs text-muted-foreground mt-1">{u.due}</div>
                <Button size="sm" variant="outline" className="mt-3 w-full">Upload</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
