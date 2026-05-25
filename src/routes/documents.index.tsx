import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PrimaryButton } from "@/components/app-shell";
import { useStore } from "@/lib/store";
import { DOC_STATUSES, DOC_TYPES, OFFICES, type DocStatus } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { OfficeChip } from "@/components/office-chip";
import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { Download, Filter } from "lucide-react";

export const Route = createFileRoute("/documents/")({
  head: () => ({
    meta: [
      { title: "Documents — DOST Caraga DTS" },
      { name: "description", content: "Browse and track all official documents." },
    ],
  }),
  component: DocumentsList,
});

function DocumentsList() {
  const { documents } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<DocStatus | "All">("All");
  const [type, setType] = useState<string>("All");
  const [office, setOffice] = useState<string>("All");

  const filtered = useMemo(() => {
    return documents.filter((d) => {
      if (status !== "All" && d.status !== status) return false;
      if (type !== "All" && d.type !== type) return false;
      if (office !== "All" && d.receivingOffice !== office) return false;
      if (q) {
        const s = q.toLowerCase();
        if (
          !d.title.toLowerCase().includes(s) &&
          !d.trackingNo.toLowerCase().includes(s) &&
          !d.sender.toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });
  }, [documents, q, status, type, office]);

  return (
    <AppShell
      title="Documents"
      action={
        <Link to="/documents/new">
          <PrimaryButton>Register Document</PrimaryButton>
        </Link>
      }
    >
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" /> Filters
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, tracking #, sender…"
            className="flex-1 min-w-[200px] rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring/30"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as DocStatus | "All")}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          >
            <option value="All">All statuses</option>
            {DOC_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          >
            <option value="All">All types</option>
            {DOC_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select
            value={office}
            onChange={(e) => setOffice(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          >
            <option value="All">All offices</option>
            {OFFICES.map((o) => <option key={o.code} value={o.code}>{o.name}</option>)}
          </select>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-muted">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Tracking #</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Sender</th>
              <th className="px-4 py-3 font-medium">Office</th>
              <th className="px-4 py-3 font-medium">Received</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((d) => (
              <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs">
                  <Link to="/documents/$id" params={{ id: d.id }} className="text-accent hover:underline">
                    {d.trackingNo}
                  </Link>
                </td>
                <td className="px-4 py-3 max-w-[320px]">
                  <Link to="/documents/$id" params={{ id: d.id }} className="font-medium hover:underline">
                    {d.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{d.type}</td>
                <td className="px-4 py-3 text-muted-foreground">{d.sender}</td>
                <td className="px-4 py-3"><OfficeChip code={d.receivingOffice} /></td>
                <td className="px-4 py-3 text-muted-foreground">
                  {format(parseISO(d.createdAt), "MMM d, yyyy")}
                </td>
                <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No documents match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-muted-foreground">
        Showing {filtered.length} of {documents.length} documents
      </div>
    </AppShell>
  );
}
