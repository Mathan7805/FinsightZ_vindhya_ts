import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import { PERSONAS, useAuth, type Persona } from "@/lib/auth";
import { changePassword } from "@/lib/auth.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/change-password")({
  head: () => ({ meta: [{ title: "Change Password — FInsightZ" }] }),
  component: ChangePassword,
});

function ChangePassword() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect to login if not authenticated
  if (!user) {
    navigate({ to: "/login" });
    return null;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const result = await changePassword({
        data: {
          email: user.email,
          currentPassword,
          newPassword,
        },
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      // Update local user state — no longer needs to change password
      const updatedUser = {
        ...user,
        mustChangePassword: false,
      };
      setUser(updatedUser);

      // Navigate to their persona dashboard
      navigate({ to: PERSONAS[user.persona as Persona].route });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary/10 grid place-items-center">
            <KeyRound className="w-6 h-6 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold">Change your password</h2>
          <p className="text-muted-foreground text-sm">
            {user.mustChangePassword
              ? "You must set a new password before continuing."
              : "Update your password below."}
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="current">Current password</Label>
            <Input
              id="current"
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new">New password</Label>
            <Input
              id="new"
              type="password"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm new password</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-[var(--gradient-emerald)] text-primary-foreground hover:opacity-95 shadow-glow"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating…
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" /> Set new password
              </>
            )}
          </Button>
        </form>

        {!user.mustChangePassword && (
          <button
            type="button"
            onClick={() => navigate({ to: PERSONAS[user.persona as Persona].route })}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to dashboard
          </button>
        )}
      </div>
    </div>
  );
}
