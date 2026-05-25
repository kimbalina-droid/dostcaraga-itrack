import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useStore } from "@/lib/store";
import { OfficeChip } from "@/components/office-chip";
import { StatusBadge } from "@/components/status-badge";
import { format, parseISO } from "date-fns";
import { Check, RotateCcw, X, CheckSquare } from "lucide-react";

export const Route = createFileRoute("/approvals")({
  head: () => ({
    meta: [
      { title: "RD Approvals — DOST Caraga" },
      { name: "description", content: "Regional Director approval queue for calendar events requiring attendance." },
    ],
  }),
  component: Approvals,
});

function Approvals() {
  const { events, setEventStatus } = useStore();
  const pending = events.filter((e) => e.status === "Pending RD Approval");
  const decided = events.filter((e) => e.requiresRD && e.status !== "Pending RD Approval");

  return (
    <AppShell title="RD Approvals">
      <div className="rounded-xl border border-border bg-card">
        <div className="p-5 border-b border-border flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-accent" />
          <h3 className="font-display font-semibold">Pending Regional Director Approval</h3>
          <span className="ml-auto text-xs text-muted-foreground">{pending.length} pending</span>
        </div>
        {pending.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No events awaiting approval.</div>
        ) : (
          <div className="divide-y divide-border">
            {pending.map((e) => (
              <div key={e.id} className="p-5 flex flex-wrap items-start gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-medium">{e.title}</h4>
                    <OfficeChip code={e.office} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(parseISO(e.date), "PPP")} · {e.startTime}–{e.endTime} · {e.venue}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Organizer: {e.organizer} · Type: {e.type}
                  </div>
                  {e.description && <p className="mt-2 text-sm">{e.description}</p>}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => setEventStatus(e.id, "Approved")}
                    className="inline-flex items-center gap-1.5 rounded-md bg-success px-3 py-1.5 text-sm font-medium text-success-foreground hover:opacity-90"
                  >
                    <Check className="h-4 w-4" /> Approve
                  </button>
                  <button
                    onClick={() => setEventStatus(e.id, "Submitted")}
                    className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-muted"
                  >
                    <RotateCcw className="h-4 w-4" /> Return
                  </button>
                  <button
                    onClick={() => setEventStatus(e.id, "Declined")}
                    className="inline-flex items-center gap-1.5 rounded-md border border-destructive/40 text-destructive bg-background px-3 py-1.5 text-sm hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4" /> Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card">
        <div className="p-5 border-b border-border">
          <h3 className="font-display font-semibold">Decision History</h3>
        </div>
        <div className="divide-y divide-border">
          {decided.length === 0 && <div className="p-5 text-sm text-muted-foreground">No history yet.</div>}
          {decided.map((e) => (
            <div key={e.id} className="p-4 flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{e.title}</div>
                <div className="text-xs text-muted-foreground">
                  {format(parseISO(e.date), "PP")} · {e.organizer}
                </div>
              </div>
              <OfficeChip code={e.office} />
              <StatusBadge status={e.status} />
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
