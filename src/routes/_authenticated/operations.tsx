import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Activity, Users, Target, TrendingUp, Upload } from "lucide-react";

export const opsNav = [
  { label: "Process Metrics", href: "/operations", icon: Activity },
  { label: "Headcount", href: "/operations/headcount", icon: Users },
  { label: "SLA & KPIs", href: "/operations/sla", icon: Target },
  { label: "Performance", href: "/operations/performance", icon: TrendingUp },
  { label: "Upload Center", href: "/operations/upload", icon: Upload },
];

export const Route = createFileRoute("/_authenticated/operations")({
  component: () => <Outlet />,
});
