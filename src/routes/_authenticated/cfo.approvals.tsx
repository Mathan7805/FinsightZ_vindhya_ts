import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, XCircle, Clock, LayoutDashboard, FileSpreadsheet, Receipt, History } from "lucide-react";
import { AppShell, PageHeader, StatCard } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/cfo/approvals")({
  head: () => ({ meta: [{ title: "Approvals — FInsightZ" }] }),
  component: Approvals,
});

const nav = [
  { label: "Overview", href: "/cfo", icon: LayoutDashboard },
  { label: "P&L Review", href: "/cfo/pnl", icon: FileSpreadsheet },
  { label: "Invoices", href: "/cfo/invoices", icon: Receipt },
  { label: "Approvals", href: "/cfo/approvals", icon: CheckCircle2 },
  { label: "Audit Log", href: "/cfo/audit", icon: History },
];

const items = [
  { id: "AP-1042", title: "November Master P&L", submitter: "Priya R. · Finance", stage: "CFO sign-off", amount: "₹581M revenue", sla: "Due in 6h", status: "pending" },
  { id: "AP-1041", title: "Vendor invoice batch #482", submitter: "AI Extraction · 14 docs", stage: "Threshold > ₹2M", amount: "₹3.10M", sla: "Due today", status: "pending" },
  { id: "AP-1040", title: "Q3 cost allocation rerun", submitter: "Operations Head", stage: "Approval", amount: "—", sla: "Due tomorrow", status: "pending" },
  { id: "AP-1039", title: "October P&L re-publish", submitter: "Priya R. · Finance", stage: "Approved", amount: "₹546M revenue", sla: "Approved 2d ago", status: "approved" },
  { id: "AP-1038", title: "Telecom vendor onboarding · Jio Biz", submitter: "IT Head", stage: "Rejected", amount: "₹0.84M / mo", sla: "Rejected 3d ago", status: "rejected" },
];

function Approvals() {
  const [tab, setTab] = useState("pending");
  const filtered = items.filter((i) => i.status === tab);

  return (
    <AppShell nav={nav}>
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <PageHeader
          eyebrow="CFO · Approvals"
          title="Approval Queue"
          subtitle="Workflow gate for uploads, AI-extracted batches and published P&L books. All actions are signed and audited."
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Pending" value="3" delta="1 SLA breach soon" />
          <StatCard label="Approved (30d)" value="42" accent="emerald" />
          <StatCard label="Rejected (30d)" value="4" />
          <StatCard label="Avg cycle time" value="11h" delta="-3h vs Oct" accent="gold" />
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="pending"><Clock className="w-3 h-3 mr-2" /> Pending (3)</TabsTrigger>
            <TabsTrigger value="approved"><CheckCircle2 className="w-3 h-3 mr-2" /> Approved</TabsTrigger>
            <TabsTrigger value="rejected"><XCircle className="w-3 h-3 mr-2" /> Rejected</TabsTrigger>
          </TabsList>
          <TabsContent value={tab} className="mt-4 space-y-3">
            {filtered.map((i) => (
              <div key={i.id} className="glass rounded-2xl p-5 shadow-elevated flex items-center justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-muted-foreground">{i.id}</span>
                    <Badge variant="outline" className="border-primary/40 text-primary">{i.stage}</Badge>
                  </div>
                  <div className="font-display font-semibold text-lg">{i.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{i.submitter} · {i.amount}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-muted-foreground">{i.sla}</div>
                  {i.status === "pending" && (
                    <>
                      <Button variant="outline">Reject</Button>
                      <Button className="bg-[var(--gradient-emerald)] text-primary-foreground shadow-glow">
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">Nothing here. Inbox zero.</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
