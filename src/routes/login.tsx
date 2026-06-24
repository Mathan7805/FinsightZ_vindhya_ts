import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { PERSONAS, useAuth, type Persona } from "@/lib/auth";
import { loginUser } from "@/lib/auth.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — FInsightZ" }] }),
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError("");
    setLoading(true);

    try {
      const result = await loginUser({ data: { email, password } });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      const u = {
        id: result.user.id,
        persona: result.user.persona as Persona,
        name: result.user.name,
        email: result.user.email,
        mustChangePassword: result.user.mustChangePassword,
      };

      setUser(u);

      if (u.mustChangePassword) {
        navigate({ to: "/change-password" });
      } else {
        navigate({ to: PERSONAS[u.persona].route });
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full bg-gold/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--gradient-emerald)] grid place-items-center shadow-glow">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display font-bold text-xl">FInsightZ</div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Financial Intelligence</div>
          </div>
        </div>

        <div className="relative space-y-6 max-w-md">
          <div className="text-xs uppercase tracking-[0.3em] text-primary">Module 01 · Profitability Automation</div>
          <h1 className="font-display font-bold text-5xl leading-tight">
            Process-wise <span className="text-gradient-emerald">profitability</span>, automated end-to-end.
          </h1>
          <p className="text-muted-foreground text-lg">
            Replace Excel consolidation with AI-extracted invoices, allocation engines, and a CFO-grade dashboard — one role at a time.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-primary" /> Role-based access · Audit logged · Versioned publishes
          </div>
        </div>

        <div className="relative grid grid-cols-3 gap-4 max-w-md">
          {[
            { k: "P&L", v: "Auto" },
            { k: "OCR", v: "AI" },
            { k: "MIS", v: "Live" },
          ].map((s) => (
            <div key={s.k} className="glass rounded-xl p-4">
              <div className="text-2xl font-display font-bold text-gradient-gold">{s.v}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{s.k}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <form onSubmit={submit} className="w-full max-w-md space-y-6">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">Sign in</div>
            <h2 className="font-display text-3xl font-bold">Welcome back</h2>
            <p className="text-muted-foreground text-sm mt-2">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-[var(--gradient-emerald)] text-primary-foreground hover:opacity-95 shadow-glow"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in…
              </>
            ) : (
              <>
                Sign in <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>

          <p className="text-[11px] text-muted-foreground text-center">
            First time? Use the temporary password provided by your admin.
          </p>
        </form>
      </div>
    </div>
  );
}
