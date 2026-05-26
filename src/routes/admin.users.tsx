import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/lib/auth";
import { OfficeChip } from "@/components/office-chip";
import { Check, Lock, ShieldAlert, Unlock, X } from "lucide-react";
import { format, parseISO } from "date-fns";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "User Management — DOST Caraga iTRACK" }] }),
  component: UserAdmin,
});

function UserAdmin() {
  const { hasRole, users, approveUser, rejectUser, toggleLock } = useAuth();

  if (!hasRole("Administrator", "Super Administrator")) {
    return (
      <AppShell title="User Management">
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-destructive" />
          <div className="text-sm">You do not have permission to access user management.</div>
        </div>
      </AppShell>
    );
  }

  const pending = users.filter((u) => u.status === "Pending");
  const active = users.filter((u) => u.status !== "Pending");

  const StatusPill = ({ s }: { s: string }) => {
    const map: Record<string, string> = {
      Active: "bg-success/10 text-success border-success/30",
      Pending: "bg-warning/15 text-[oklch(0.45_0.13_75)] border-warning/40",
      Rejected: "bg-destructive/10 text-destructive border-destructive/30",
      Locked: "bg-muted text-muted-foreground border-border",
    };
    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${map[s] ?? ""}`}>
        {s}
      </span>
    );
  };

  return (
    <AppShell title="User Management">
      <div className="rounded-xl border border-border bg-card">
        <div className="p-5 border-b border-border flex items-center gap-2">
          <h3 className="font-display font-semibold">Pending Account Requests</h3>
          <span className="ml-auto text-xs text-muted-foreground">{pending.length} pending</span>
        </div>
        {pending.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No pending requests.</div>
        ) : (
          <div className="divide-y divide-border">
            {pending.map((u) => (
              <div key={u.id} className="p-5 flex flex-wrap items-start gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{u.name}</span>
                    <OfficeChip code={u.office} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {u.position} · {u.email} · @{u.username}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {u.roles.map((r) => (
                      <span key={r} className="rounded-full bg-muted px-2 py-0.5 text-[11px]">{r}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approveUser(u.id)}
                    className="inline-flex items-center gap-1.5 rounded-md bg-success px-3 py-1.5 text-sm font-medium text-success-foreground hover:opacity-90"
                  >
                    <Check className="h-4 w-4" /> Approve
                  </button>
                  <button
                    onClick={() => rejectUser(u.id)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-destructive/40 text-destructive bg-background px-3 py-1.5 text-sm hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-display font-semibold">All Accounts</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Username</th>
              <th className="px-4 py-3 font-medium">Office</th>
              <th className="px-4 py-3 font-medium">Roles</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {active.map((u) => (
              <tr key={u.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-muted-foreground">{u.position}</div>
                </td>
                <td className="px-4 py-3 font-mono text-xs">@{u.username}</td>
                <td className="px-4 py-3"><OfficeChip code={u.office} /></td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {u.roles.map((r) => (
                      <span key={r} className="rounded-full bg-muted px-2 py-0.5 text-[11px]">{r}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3"><StatusPill s={u.status} /></td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{format(parseISO(u.createdAt), "PP")}</td>
                <td className="px-4 py-3 text-right">
                  {u.status !== "Rejected" && (
                    <button
                      onClick={() => toggleLock(u.id)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-2.5 py-1 text-xs hover:bg-muted"
                    >
                      {u.status === "Locked" ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                      {u.status === "Locked" ? "Unlock" : "Lock"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
