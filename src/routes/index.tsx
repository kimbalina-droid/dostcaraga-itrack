import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PrimaryButton } from "@/components/app-shell";
import { useStore } from "@/lib/store";
import { OFFICES, type OfficeCode } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { OfficeChip } from "@/components/office-chip";
import { FileText, Clock, AlertCircle, CheckCircle2, CalendarDays, ArrowUpRight } from "lucide-react";
import { format, parseISO, isAfter } from "date-fns";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — DOST Caraga DTS" },
      { name: "description", content: "Overview of documents and regional activities for DOST Caraga." },
    ],
  }),
  component: Dashboard,
});

function Stat({
  label, value, hint, icon: Icon, tone,
}: { label: string; value: number | string; hint?: string; icon: typeof FileText; tone: "info" | "warning" | "success" | "accent" }) {
  const toneMap = {
    info: "bg-info/10 text-info",
    warning: "bg-warning/15 text-[oklch(0.45_0.15_75)]",
    success: "bg-success/10 text-success",
    accent: "bg-accent/10 text-accent",
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="mt-2 text-3xl font-display font-semibold">{value}</div>
          {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
        </div>
        <div className={`rounded-lg p-2 ${toneMap[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { documents, events } = useStore();
  const total = documents.length;
  const ongoing = documents.filter((d) => d.status === "Ongoing" || d.status === "Routed").length;
  const pending = documents.filter((d) => d.status === "Pending" || d.status === "For Approval").length;
  const completed = documents.filter((d) => d.status === "Released" || d.status === "Closed" || d.status === "Approved").length;

  const recent = [...documents].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const urgent = documents.filter((d) => d.status === "For Approval" || d.status === "Pending").slice(0, 4);

  const upcoming = events
    .filter((e) => e.status === "Approved" && isAfter(parseISO(e.date), new Date(Date.now() - 86400000)))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const byOffice = (OFFICES as { code: OfficeCode; name: string }[]).map((o) => ({
    office: o.code,
    count: documents.filter((d) => d.receivingOffice === o.code).length,
  }));

  return (
    <AppShell
      title="Dashboard"
      action={
        <Link to="/documents/new">
          <PrimaryButton>New Document</PrimaryButton>
        </Link>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Total Documents" value={total} hint="All time" icon={FileText} tone="info" />
        <Stat label="Ongoing" value={ongoing} hint="In active routing" icon={Clock} tone="accent" />
        <Stat label="Pending Action" value={pending} hint="Requires attention" icon={AlertCircle} tone="warning" />
        <Stat label="Completed" value={completed} hint="Released or closed" icon={CheckCircle2} tone="success" />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold">Documents by Receiving Office</h3>
              <p className="text-xs text-muted-foreground">Distribution across divisions</p>
            </div>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byOffice} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="office" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-accent" /> Upcoming Activities
            </h3>
            <Link to="/calendar" className="text-xs text-accent hover:underline flex items-center gap-1">
              View calendar <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {upcoming.length === 0 && <li className="text-sm text-muted-foreground">No upcoming activities.</li>}
            {upcoming.map((e) => (
              <li key={e.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                <div className="text-center w-12 shrink-0">
                  <div className="text-[10px] uppercase text-muted-foreground">
                    {format(parseISO(e.date), "MMM")}
                  </div>
                  <div className="text-lg font-display font-semibold leading-none">
                    {format(parseISO(e.date), "d")}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{e.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {e.startTime}–{e.endTime} · {e.venue}
                  </div>
                  <div className="mt-1.5"><OfficeChip code={e.office} /></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="font-display font-semibold">Recently Received</h3>
            <Link to="/documents" className="text-xs text-accent hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-border">
            {recent.map((d) => (
              <Link
                key={d.id}
                to="/documents/$id"
                params={{ id: d.id }}
                className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="font-mono text-xs text-muted-foreground w-32 shrink-0">{d.trackingNo}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{d.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {d.sender} · {format(parseISO(d.createdAt), "MMM d, h:mm a")}
                  </div>
                </div>
                <OfficeChip code={d.receivingOffice} />
                <StatusBadge status={d.status} />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card">
          <div className="p-5 border-b border-border">
            <h3 className="font-display font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-warning" /> Needs Immediate Action
            </h3>
          </div>
          <div className="divide-y divide-border">
            {urgent.length === 0 && <div className="p-5 text-sm text-muted-foreground">All caught up.</div>}
            {urgent.map((d) => (
              <Link
                key={d.id}
                to="/documents/$id"
                params={{ id: d.id }}
                className="block p-4 hover:bg-muted/50"
              >
                <div className="text-sm font-medium truncate">{d.title}</div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-muted-foreground">{d.trackingNo}</span>
                  <StatusBadge status={d.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
