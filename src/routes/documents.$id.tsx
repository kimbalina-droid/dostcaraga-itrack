import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useStore } from "@/lib/store";
import { DOC_STATUSES, OFFICES, type DocStatus, type OfficeCode } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { OfficeChip } from "@/components/office-chip";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { ArrowLeft, Send, Clock, FileText } from "lucide-react";

export const Route = createFileRoute("/documents/$id")({
  head: ({ params }) => ({
    meta: [{ title: `Document ${params.id} — DOST Caraga DTS` }],
  }),
  component: DocumentDetail,
  notFoundComponent: () => (
    <AppShell title="Document not found">
      <p className="text-sm text-muted-foreground">This document does not exist.</p>
      <Link to="/documents" className="mt-4 inline-block text-accent hover:underline text-sm">
        ← Back to documents
      </Link>
    </AppShell>
  ),
});

function DocumentDetail() {
  const { id } = Route.useParams();
  const { documents, appendTimeline, updateDocument } = useStore();
  const doc = documents.find((d) => d.id === id);
  if (!doc) throw notFound();

  const [remarks, setRemarks] = useState("");
  const [newStatus, setNewStatus] = useState<DocStatus>(doc.status);
  const [routeTo, setRouteTo] = useState<OfficeCode>(doc.routedTo);
  const [rdInstr, setRdInstr] = useState(doc.directorInstructions ?? "");

  const addUpdate = () => {
    if (!remarks.trim()) return;
    appendTimeline(doc.id, {
      id: `t-${Date.now()}`,
      at: new Date().toISOString(),
      officer: "Maria S. Cabrera",
      action: newStatus !== doc.status ? `Status updated to ${newStatus}` : "Remarks added",
      remarks,
      status: newStatus,
    });
    setRemarks("");
  };

  const routeDoc = () => {
    appendTimeline(doc.id, {
      id: `t-${Date.now()}`,
      at: new Date().toISOString(),
      officer: "Maria S. Cabrera",
      action: `Routed to ${routeTo}`,
      status: "Routed",
    });
    updateDocument(doc.id, { routedTo: routeTo });
  };

  const saveInstr = () => updateDocument(doc.id, { directorInstructions: rdInstr });

  return (
    <AppShell
      title={doc.title}
      action={
        <Link to="/documents" className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-muted">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-mono text-xs text-muted-foreground">{doc.trackingNo}</div>
                <h2 className="mt-1 font-display text-xl font-semibold">{doc.title}</h2>
                {doc.description && <p className="mt-2 text-sm text-muted-foreground">{doc.description}</p>}
              </div>
              <StatusBadge status={doc.status} />
            </div>
            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <Info label="Type" value={doc.type} />
              <Info label="Nature" value={doc.nature} />
              <Info label="Confidentiality" value={doc.confidentiality} />
              <Info label="Sender" value={doc.sender} />
              <Info label="Date Received" value={format(parseISO(doc.createdAt), "PP")} />
              <Info label="Time Received" value={doc.timeReceived} />
              <Info label="Receiving Officer" value={doc.receivingOfficer} />
              <Info label="Receiving Office" value={<OfficeChip code={doc.receivingOffice} />} />
              <Info label="Routed To" value={<OfficeChip code={doc.routedTo} />} />
              {doc.dateReleased && <Info label="Date Released" value={doc.dateReleased} />}
              {doc.fileName && <Info label="Attachment" value={`📎 ${doc.fileName}`} />}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" /> Document Timeline
            </h3>
            <ol className="mt-5 relative border-l-2 border-border ml-2 space-y-5">
              {doc.timeline.map((t) => (
                <li key={t.id} className="pl-5 relative">
                  <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-accent ring-4 ring-background" />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">{t.action}</span>
                    {t.status && <StatusBadge status={t.status} />}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {format(parseISO(t.at), "PPp")} · {t.officer}
                  </div>
                  {t.remarks && (
                    <div className="mt-2 rounded-md bg-muted/60 p-3 text-sm">{t.remarks}</div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold mb-3">Add Update</h3>
            <label className="block text-xs font-medium mb-1">Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as DocStatus)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mb-3"
            >
              {DOC_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <label className="block text-xs font-medium mb-1">Remarks / Action Taken</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mb-3"
              placeholder="Describe the action taken…"
            />
            <button
              onClick={addUpdate}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
            >
              <Send className="h-4 w-4" /> Post Update
            </button>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold mb-3">Route Document</h3>
            <select
              value={routeTo}
              onChange={(e) => setRouteTo(e.target.value as OfficeCode)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mb-3"
            >
              {OFFICES.map((o) => <option key={o.code} value={o.code}>{o.name}</option>)}
            </select>
            <button
              onClick={routeDoc}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              <FileText className="h-4 w-4" /> Route to office
            </button>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold mb-3">RD Instructions</h3>
            <textarea
              value={rdInstr}
              onChange={(e) => setRdInstr(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mb-3"
              placeholder="Enter Regional Director's instructions…"
            />
            <button
              onClick={saveInstr}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Save Instructions
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-medium">{value}</div>
    </div>
  );
}
