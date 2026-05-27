import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const listApprovals = createServerFn({ method: "GET" })
  .inputValidator((d: { status?: "pending" | "approved" | "rejected" }) => d ?? {})
  .handler(async ({ data }) => {
    const q = supabaseAdmin
      .from("approvals")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (data?.status) q.eq("status", data.status);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const decideApproval = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({
      id: z.string().uuid(),
      decision: z.enum(["approved", "rejected"]),
      notes: z.string().max(500).optional(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const { data: approval, error: aerr } = await supabaseAdmin
      .from("approvals")
      .update({ status: data.decision, decided_at: new Date().toISOString(), notes: data.notes ?? null })
      .eq("id", data.id)
      .select()
      .single();
    if (aerr) throw new Error(aerr.message);

    // Mirror decision to the source row
    if (approval?.source_type === "invoice") {
      await supabaseAdmin
        .from("invoices")
        .update({ approval_status: data.decision, decided_at: new Date().toISOString() })
        .eq("id", approval.source_id);
    } else if (approval?.source_type === "pnl_upload") {
      await supabaseAdmin
        .from("pnl_runs")
        .update({ published: data.decision === "approved" })
        .eq("upload_id", approval.source_id);
    }
    return approval;
  });

export const approvalStats = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("approvals")
    .select("status, amount, source_type");
  if (error) throw new Error(error.message);
  const stat = { pending: 0, approved: 0, rejected: 0, pendingAmount: 0 };
  for (const r of data ?? []) {
    if (r.status === "pending") {
      stat.pending++;
      stat.pendingAmount += Number(r.amount ?? 0);
    } else if (r.status === "approved") stat.approved++;
    else if (r.status === "rejected") stat.rejected++;
  }
  return stat;
});

export const approvedInvoiceTotals = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("invoices")
    .select("kind, amount, approval_status")
    .eq("approval_status", "approved");
  if (error) throw new Error(error.message);
  const t = { ar_issued: 0, ar_billing: 0, ap: 0, count: 0 };
  for (const r of data ?? []) {
    const amt = Number(r.amount ?? 0);
    if (r.kind === "client_issued") t.ar_issued += amt;
    else if (r.kind === "client_billing") t.ar_billing += amt;
    else if (r.kind === "vendor_received") t.ap += amt;
    t.count++;
  }
  return t;
});
