import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated")({
  component: AuthGate,
});

function AuthGate() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!ready) return;
    if (!user) navigate({ to: "/login" });
    else if (user.mustChangePassword) navigate({ to: "/change-password" });
  }, [ready, user, navigate]);

  if (!ready || !user || user.mustChangePassword) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground text-sm">
        Securing your workspace…
      </div>
    );
  }
  return <Outlet />;
}
