import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, PrimaryButton } from "@/components/app-shell";
import { useStore } from "@/lib/store";
import {
  DOC_TYPES, OFFICES, generateTrackingNo,
  type OfficeCode, type DocumentRecord,
} from "@/lib/mock-data";
import { useState } from "react";
import { Save, Upload } from "lucide-react";

export const Route = createFileRoute("/documents/new")({
  head: () => ({
    meta: [
      { title: "Register Document — DOST Caraga DTS" },
      { name: "description", content: "Register and route a new incoming document." },
    ],
  }),
  component: NewDocument,
});

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-foreground mb-1">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30";

function NewDocument() {
  const { addDocument } = useStore();
  const navigate = useNavigate();
  const [trackingNo] = useState(generateTrackingNo());

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: DOC_TYPES[0] as string,
    nature: "External",
    sender: "",
    dateReceived: new Date().toISOString().slice(0, 10),
    timeReceived: new Date().toTimeString().slice(0, 5),
    receivingOfficer: "Maria S. Cabrera",
    receivingOffice: "ORD" as OfficeCode,
    routedTo: "ORD" as OfficeCode,
    confidentiality: "Normal" as "Normal" | "Confidential" | "Restricted",
    directorInstructions: "",
    fileName: "",
  });

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.sender) return;
    const now = new Date().toISOString();
    const doc: DocumentRecord = {
      id: `d-${Date.now()}`,
      trackingNo,
      title: form.title,
      description: form.description,
      type: form.type,
      nature: form.nature,
      sender: form.sender,
      dateReceived: form.dateReceived,
      timeReceived: form.timeReceived,
      receivingOfficer: form.receivingOfficer,
      receivingOffice: form.receivingOffice,
      routedTo: form.routedTo,
      confidentiality: form.confidentiality,
      status: "Received",
      directorInstructions: form.directorInstructions || undefined,
      fileName: form.fileName || undefined,
      timeline: [
        {
          id: `t-${Date.now()}`,
          at: now,
          officer: form.receivingOfficer,
          action: "Document registered & received",
          status: "Received",
        },
      ],
      createdAt: now,
    };
    addDocument(doc);
    navigate({ to: "/documents/$id", params: { id: doc.id } });
  };

  return (
    <AppShell title="Register Document">
      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Tracking Number">
                <input value={trackingNo} readOnly className={`${inputCls} font-mono bg-muted/50`} />
              </Field>
              <Field label="Type of Document" required>
                <select value={form.type} onChange={(e) => update("type", e.target.value)} className={inputCls}>
                  {DOC_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <div className="md:col-span-2">
                <Field label="Document Title / Subject" required>
                  <input
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                    placeholder="e.g., Request for Endorsement – Regional Science Fair"
                    className={inputCls}
                  />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Description">
                  <textarea
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    rows={3}
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field label="Nature of Communication">
                <select value={form.nature} onChange={(e) => update("nature", e.target.value)} className={inputCls}>
                  <option>External</option>
                  <option>Internal</option>
                  <option>Inter-agency</option>
                </select>
              </Field>
              <Field label="Sender / Originating Office" required>
                <input
                  value={form.sender}
                  onChange={(e) => update("sender", e.target.value)}
                  placeholder="e.g., DepEd Regional Office XIII"
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold mb-4">Receipt &amp; Routing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Date Received" required>
                <input
                  type="date"
                  value={form.dateReceived}
                  onChange={(e) => update("dateReceived", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Time Received" required>
                <input
                  type="time"
                  value={form.timeReceived}
                  onChange={(e) => update("timeReceived", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Receiving Officer">
                <input
                  value={form.receivingOfficer}
                  onChange={(e) => update("receivingOfficer", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Receiving Division / Unit">
                <select
                  value={form.receivingOffice}
                  onChange={(e) => update("receivingOffice", e.target.value as OfficeCode)}
                  className={inputCls}
                >
                  {OFFICES.map((o) => <option key={o.code} value={o.code}>{o.name}</option>)}
                </select>
              </Field>
              <Field label="Routed Office / Division">
                <select
                  value={form.routedTo}
                  onChange={(e) => update("routedTo", e.target.value as OfficeCode)}
                  className={inputCls}
                >
                  {OFFICES.map((o) => <option key={o.code} value={o.code}>{o.name}</option>)}
                </select>
              </Field>
              <Field label="Confidentiality Level">
                <select
                  value={form.confidentiality}
                  onChange={(e) => update("confidentiality", e.target.value as typeof form.confidentiality)}
                  className={inputCls}
                >
                  <option>Normal</option>
                  <option>Confidential</option>
                  <option>Restricted</option>
                </select>
              </Field>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold mb-4">Regional Director Instructions</h3>
            <Field label="Instructions / Directives">
              <textarea
                value={form.directorInstructions}
                onChange={(e) => update("directorInstructions", e.target.value)}
                rows={3}
                placeholder="Optional — note any specific instructions from the RD."
                className={inputCls}
              />
            </Field>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold mb-3">Attachment</h3>
            <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 px-4 py-8 text-center cursor-pointer hover:bg-muted/50">
              <Upload className="h-6 w-6 text-muted-foreground" />
              <div className="text-sm font-medium">Upload scanned copy</div>
              <div className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</div>
              <input
                type="file"
                className="hidden"
                onChange={(e) => update("fileName", e.target.files?.[0]?.name ?? "")}
              />
            </label>
            {form.fileName && (
              <div className="mt-3 text-xs text-muted-foreground truncate">📎 {form.fileName}</div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold mb-2">Ready to register?</h3>
            <p className="text-xs text-muted-foreground mb-4">
              The document will be created with status <strong>Received</strong> and an initial timeline entry.
            </p>
            <PrimaryButton type="submit" icon={Save}>Register Document</PrimaryButton>
          </div>
        </div>
      </form>
    </AppShell>
  );
}
