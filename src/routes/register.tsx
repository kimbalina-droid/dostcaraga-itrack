import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth, ROLES, type Role } from "@/lib/auth";
import { OFFICES, type OfficeCode } from "@/lib/mock-data";
import { CheckCircle2, UserPlus } from "lucide-react";
import logo from "@/assets/itrack-logo.png";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Request Access — DOST Caraga iTRACK" }] }),
  component: RegisterPage,
});

const REQUESTABLE_ROLES: Role[] = ROLES.filter((r) => r !== "Super Administrator") as Role[];

function RegisterPage() {
  const { registerRequest } = useAuth();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    position: "",
    office: "ORD" as OfficeCode,
    username: "",
    email: "",
    contact: "",
    password: "",
    confirm: "",
    requestedRoles: ["Receiving Officer"] as Role[],
  });
  const [error, setError] = useState<string | null>(null);

  const toggleRole = (r: Role) =>
    setForm((f) => ({
      ...f,
      requestedRoles: f.requestedRoles.includes(r)
        ? f.requestedRoles.filter((x) => x !== r)
        : [...f.requestedRoles, r],
    }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    if (form.requestedRoles.length === 0) return setError("Select at least one role.");
    registerRequest({
      name: form.name,
      position: form.position,
      office: form.office,
      username: form.username,
      email: form.email,
      contact: form.contact,
      roles: form.requestedRoles,
    });
    setSubmitted(true);
  };

  const ic = "w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30";

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="max-w-md text-center rounded-xl border border-border bg-card p-8">
          <CheckCircle2 className="h-12 w-12 text-success mx-auto" />
          <h1 className="mt-4 font-display text-xl font-semibold">Registration submitted</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account request has been forwarded to the system administrator. You'll be able to
            sign in once your account is approved.
          </p>
          <button
            onClick={() => navigate({ to: "/login" })}
            className="mt-6 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
          >
            Back to sign-in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link to="/login" className="inline-flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <img src={logo} alt="iTRACK" width={36} height={36} className="object-contain" />
          </div>
          <div>
            <div className="font-display font-semibold">DOST Caraga iTRACK</div>
            <div className="text-xs text-muted-foreground">Request system access</div>
          </div>
        </Link>

        <div className="rounded-xl border border-border bg-card p-6">
          <h1 className="font-display text-2xl font-semibold">Request Access</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Submit your details. Your account will be reviewed and approved by an administrator before activation.
          </p>

          <form onSubmit={submit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-medium">Full Name</label>
              <input className={ic} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium">Position</label>
              <input className={ic} required value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium">Office / Division</label>
              <select className={ic} value={form.office} onChange={(e) => setForm({ ...form, office: e.target.value as OfficeCode })}>
                {OFFICES.map((o) => <option key={o.code} value={o.code}>{o.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium">Username</label>
              <input className={ic} required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium">Email</label>
              <input className={ic} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium">Contact Number</label>
              <input className={ic} value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
            </div>
            <div />
            <div>
              <label className="text-xs font-medium">Password</label>
              <input className={ic} type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium">Confirm Password</label>
              <input className={ic} type="password" required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-medium mb-2 block">Requested Roles</label>
              <div className="grid grid-cols-2 gap-2">
                {REQUESTABLE_ROLES.map((r) => (
                  <label key={r} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm cursor-pointer hover:bg-muted/50">
                    <input
                      type="checkbox"
                      checked={form.requestedRoles.includes(r)}
                      onChange={() => toggleRole(r)}
                      className="h-4 w-4"
                    />
                    {r}
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="md:col-span-2 rounded-md border border-destructive/30 bg-destructive/10 text-destructive text-sm px-3 py-2">
                {error}
              </div>
            )}

            <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
              <Link to="/login" className="rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-muted">
                Cancel
              </Link>
              <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
                <UserPlus className="h-4 w-4" /> Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
