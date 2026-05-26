import { createFileRoute } from "@tanstack/react-router";
import { Crown, TrendingUp, Globe, Building2, Briefcase, Target, AlertCircle } from "lucide-react";
import { AppShell, PageHeader, StatCard } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

export const Route = createFileRoute("/_authenticated/ceo")({
  head: () => ({ meta: [{ title: "CEO / CXO Dashboard — FInsightZ" }] }),
  component: CEODashboard,
});

const nav = [
  { label: "Enterprise Pulse", href: "/ceo", icon: Crown },
  { label: "Business Units", href: "/ceo", icon: Briefcase },
  { label: "Geography", href: "/ceo", icon: Globe },
  { label: "Strategic KPIs", href: "/ceo", icon: Target },
  { label: "Risk & Alerts", href: "/ceo", icon: AlertCircle },
];

const ebitda = [
  { q: "Q1'24", rev: 1480, ebitda: 312 },
  { q: "Q2'24", rev: 1562, ebitda: 348 },
  { q: "Q3'24", rev: 1635, ebitda: 372 },
  { q: "Q4'24", rev: 1714, ebitda: 401 },
  { q: "Q1'25", rev: 1802, ebitda: 438 },
  { q: "Q2'25", rev: 1884, ebitda: 471 },
];

const bu = [
  { n: "BPO", r: 681 },
  { n: "Tech Svc", r: 472 },
  { n: "Analytics", r: 318 },
  { n: "Consulting", r: 224 },
  { n: "Platform", r: 189 },
];

const geo = [
  { name: "India", value: 42 },
  { name: "USA", value: 28 },
  { name: "EMEA", value: 18 },
  { name: "APAC", value: 12 },
];
const GEO_COLORS = ["oklch(0.72 0.16 162)", "oklch(0.78 0.13 85)", "oklch(0.65 0.18 200)", "oklch(0.68 0.14 320)"];

function CEODashboard() {
  return (
    <AppShell nav={nav}>
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <PageHeader
          eyebrow="CEO / CXO Workspace"
          title="Enterprise Performance Cockpit"
          subtitle="Cross-BU profitability, growth velocity, geography mix and strategic risk — synthesised from every finance, ops, IT and facilities upload."
          actions={<Badge variant="outline" className="border-gold/40 text-gold">Board-ready · v2.1</Badge>}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Enterprise Revenue (TTM)" value="₹ 7,184 Cr" delta="+18.4% YoY" accent="emerald" />
          <StatCard label="EBITDA Margin" value="25.0%" delta="+2.1 pts" accent="gold" />
          <StatCard label="Net Profit (TTM)" value="₹ 1,194 Cr" delta="+22.7% YoY" />
          <StatCard label="Cash Position" value="₹ 2,840 Cr" delta="+₹ 312 Cr QoQ" />
          <StatCard label="Active Clients" value="284" delta="+18 this Q" />
          <StatCard label="Total Workforce" value="12,418" delta="+612 MoM" />
          <StatCard label="Order Book" value="₹ 9,420 Cr" delta="1.31x cover" accent="emerald" />
          <StatCard label="Avg Contract Value" value="₹ 28.4 Cr" delta="+9.2%" accent="gold" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 glass rounded-2xl p-6 shadow-elevated">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold text-lg">Revenue & EBITDA Trajectory</h3>
                <p className="text-xs text-muted-foreground">6 quarters · ₹ Crore</p>
              </div>
              <Badge variant="outline" className="border-primary/40 text-primary">
                <TrendingUp className="w-3 h-3 mr-1" /> Trending up
              </Badge>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={ebitda}>
                <defs>
                  <linearGradient id="cr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.16 162)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.72 0.16 162)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.13 85)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.78 0.13 85)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0.03 165 / 40%)" />
                <XAxis dataKey="q" stroke="oklch(0.72 0.02 150)" fontSize={12} />
                <YAxis stroke="oklch(0.72 0.02 150)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.035 165)", border: "1px solid oklch(0.32 0.03 165)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="rev" stroke="oklch(0.72 0.16 162)" fill="url(#cr)" strokeWidth={2} />
                <Area type="monotone" dataKey="ebitda" stroke="oklch(0.78 0.13 85)" fill="url(#ce)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-2xl p-6 shadow-elevated">
            <h3 className="font-display font-semibold text-lg mb-1">Geography Mix</h3>
            <p className="text-xs text-muted-foreground mb-4">Revenue share %</p>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={geo} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {geo.map((_, i) => <Cell key={i} fill={GEO_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.22 0.035 165)", border: "1px solid oklch(0.32 0.03 165)", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {geo.map((g, i) => (
                <div key={g.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: GEO_COLORS[i] }} />
                  <span className="text-muted-foreground">{g.name}</span>
                  <span className="ml-auto font-semibold">{g.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 glass rounded-2xl p-6 shadow-elevated">
            <h3 className="font-display font-semibold text-lg mb-1">Business Unit Revenue</h3>
            <p className="text-xs text-muted-foreground mb-4">Quarter to date · ₹ Crore</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={bu}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0.03 165 / 40%)" />
                <XAxis dataKey="n" stroke="oklch(0.72 0.02 150)" fontSize={12} />
                <YAxis stroke="oklch(0.72 0.02 150)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.035 165)", border: "1px solid oklch(0.32 0.03 165)", borderRadius: 12 }} />
                <Bar dataKey="r" fill="oklch(0.72 0.16 162)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-2xl p-6 shadow-elevated">
            <h3 className="font-display font-semibold text-lg mb-4">Strategic Alerts</h3>
            <div className="space-y-3">
              {[
                { t: "Collections BU margin dropped 4 pts QoQ", s: "high" },
                { t: "Chennai DR site review pending — Facilities", s: "medium" },
                { t: "3 SaaS contracts expiring in 30 days — IT", s: "medium" },
                { t: "DSO improved by 3 days vs target", s: "low" },
              ].map((a) => (
                <div key={a.t} className="flex items-start gap-3 rounded-xl border border-border bg-card/30 px-4 py-3">
                  <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                    a.s === "high" ? "bg-destructive" : a.s === "medium" ? "bg-warning" : "bg-success"
                  }`} />
                  <span className="text-sm">{a.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 shadow-elevated">
          <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" /> Top 5 Client Concentration
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
                  <th className="py-2">Client</th><th>BU</th><th>Revenue (TTM)</th><th>% Share</th><th>Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {[
                  ["Aurora Bank", "BPO", "₹ 412 Cr", "5.7%", "Green"],
                  ["Helix Insurance", "Analytics", "₹ 318 Cr", "4.4%", "Green"],
                  ["Northwind Telecom", "Tech Svc", "₹ 286 Cr", "3.9%", "Amber"],
                  ["Pioneer Health", "Consulting", "₹ 211 Cr", "2.9%", "Green"],
                  ["Vega Retail", "Platform", "₹ 184 Cr", "2.5%", "Amber"],
                ].map((r) => (
                  <tr key={r[0]}>
                    <td className="py-3 font-medium">{r[0]}</td>
                    <td className="text-muted-foreground">{r[1]}</td>
                    <td className="font-semibold">{r[2]}</td>
                    <td>{r[3]}</td>
                    <td>
                      <Badge variant="outline" className={
                        r[4] === "Green" ? "border-success/40 text-success" : "border-warning/40 text-warning"
                      }>
                        {r[4]}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
