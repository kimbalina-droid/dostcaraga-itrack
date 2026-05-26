import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useAuth, type AuditEntry } from "@/lib/auth";
import { format, parseISO } from "date-fns";
import { ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/audit")({
  head: () => ({ meta: [{ title: "Audit Logs — DOST Caraga iTRACK" }] }),
  component: AuditPage,
});

const CATEGORIES: AuditEntry["category"][] = [
  "Auth", "Document", "Routing", "Approval", "Calendar", "User", "Settings", "Security",
];

function AuditPage() {
  const { audit, hasRole } = useAuth();
  const [cat, setCat] = useState<AuditEntry["category"] | "All">("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () =>
      audit.filter((a) => {
        if (cat !== "All" && a.category !== cat) return false;
        if (q) {
          const s = q.toLowerCase();
          if (
            !a.action.toLowerCase().includes(s) &&
            !a.actor.toLowerCase().includes(s) &&
            !(a.details ?? "").toLowerCase().includes(s)
          )
            return false;
        }
        return true;
      }),
    [audit, cat, q],
  );

  if (!hasRole("Super Administrator")) {
    return (
      <AppShell title="Audit Logs">
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-destructive" />
          <div className="text-sm">Audit logs are restricted to the Super Administrator.</div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Audit Logs">
      <div className="rounded-xl border border-border bg-card p-4 flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search actor, action, details…"
          className="flex-1 min-w-[220px] rounded-md border border-input bg-background px-3 py-1.5 text-sm"
        />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value as AuditEntry["category"] | "All")}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Timestamp</th>
              <th className="px-4 py-3 font-medium">Actor</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                  {format(parseISO(a.at), "PP p")}
                </td>
                <td className="px-4 py-3 font-mono text-xs">@{a.actor}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">{a.category}</span>
                </td>
                <td className="px-4 py-3 font-medium">{a.action}</td>
                <td className="px-4 py-3 text-muted-foreground">{a.details ?? "—"}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No log entries match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {filtered.length} of {audit.length} entries · entries are append-only and cannot be deleted.
      </p>
    </AppShell>
  );
}
