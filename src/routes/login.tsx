import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Eye, EyeOff, ShieldAlert, LogIn } from "lucide-react";
import logo from "@/assets/itrack-logo.png";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — DOST Caraga iTRACK" },
      { name: "description", content: "Secure sign-in for DOST Caraga iTRACK personnel." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const r = login(username.trim(), password);
    if (!r.ok) setError(r.error ?? "Sign-in failed.");
    else navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Brand panel */}
      <aside className="hidden lg:flex flex-col justify-between bg-sidebar text-sidebar-foreground p-10 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center">
            <img src={logo} alt="iTRACK" width={44} height={44} className="object-contain" />
          </div>
          <div>
            <div className="font-display text-lg font-semibold">DOST Caraga</div>
            <div className="text-xs text-sidebar-foreground/70 tracking-widest uppercase">iTRACK</div>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="font-display text-3xl font-semibold leading-tight">
            Integrated Tracking, Records, Activity &amp; Calendar Keeper
          </h2>
          <p className="mt-4 text-sm text-sidebar-foreground/75 leading-relaxed">
            The centralized operational platform of DOST Caraga for document accountability,
            workflow efficiency, and regional activity coordination.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-sidebar-foreground/80">
            <li>• Document Tracking System (DTS)</li>
            <li>• Regional Calendar Management</li>
            <li>• Regional Director approval workflow</li>
            <li>• Multi-office collaboration &amp; audit trail</li>
          </ul>
        </div>

        <div className="text-xs text-sidebar-foreground/60">
          © {new Date().getFullYear()} Department of Science and Technology — Caraga
        </div>

        <div
          className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full opacity-20"
          style={{ background: "radial-gradient(closest-side, var(--accent), transparent)" }}
        />
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <img src={logo} alt="iTRACK" width={36} height={36} className="object-contain" />
            </div>
            <div>
              <div className="font-display font-semibold">DOST Caraga iTRACK</div>
              <div className="text-xs text-muted-foreground">Sign in to continue</div>
            </div>
          </div>

          <h1 className="font-display text-2xl font-semibold">Sign in to your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Use your DOST Caraga credentials to access the system.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1">Username or Email</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="e.g., maria"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium">Password</label>
                <button
                  type="button"
                  className="text-xs text-accent hover:underline"
                  onClick={() => alert("Contact your administrator to reset your password.")}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full rounded-md border border-input bg-card px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring/30"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4"
              />
              Remember me on this device
            </label>

            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 text-destructive text-sm px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90"
            >
              <LogIn className="h-4 w-4" /> Sign in
            </button>

            <p className="text-center text-sm text-muted-foreground">
              No account yet?{" "}
              <Link to="/register" className="text-accent font-medium hover:underline">
                Request access
              </Link>
            </p>
          </form>

          <div className="mt-6 flex items-start gap-2 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-foreground/80">
            <ShieldAlert className="h-4 w-4 text-[oklch(0.5_0.15_75)] mt-0.5 shrink-0" />
            <span>
              Authorized DOST Caraga personnel only. Unauthorized access is prohibited and subject to monitoring.
            </span>
          </div>

          <div className="mt-6 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
            <div className="font-medium text-foreground mb-1">Demo accounts (any password):</div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
              <span><code>admin</code> — Super Admin</span>
              <span><code>rd</code> — Regional Director</span>
              <span><code>maria</code> — Receiving Officer</span>
              <span><code>anna</code> — Scheduler</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
