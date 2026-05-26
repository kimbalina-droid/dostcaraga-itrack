import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PrimaryButton } from "@/components/app-shell";
import { useStore } from "@/lib/store";
import { OFFICES, officeMeta, type OfficeCode, type CalendarEvent } from "@/lib/mock-data";
import { useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { OfficeChip } from "@/components/office-chip";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Regional Calendar — DOST Caraga" },
      {
        name: "description",
        content: "Centralized calendar of all DOST Caraga activities and events.",
      },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const { events, addEvent } = useStore();
  const [cursor, setCursor] = useState(new Date());
  const [view, setView] = useState<"Day" | "Week" | "Month" | "Agenda">("Month");
  const [filterOffice, setFilterOffice] = useState<OfficeCode | "All">("All");
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<CalendarEvent | null>(null);

  const visibleEvents = useMemo(
    () =>
      events.filter(
        (e) => e.status === "Approved" && (filterOffice === "All" || e.office === filterOffice),
      ),
    [events, filterOffice],
  );

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const weekDays = eachDayOfInterval({ start: startOfWeek(cursor), end: endOfWeek(cursor) });
  const dayDate = startOfDay(cursor);

  const dayEvents = (d: Date) => visibleEvents.filter((e) => isSameDay(parseISO(e.date), d));
  const viewLabel = (() => {
    if (view === "Day") return format(cursor, "EEEE, MMMM d, yyyy");
    if (view === "Week") {
      const start = startOfWeek(cursor);
      const end = endOfWeek(cursor);
      return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
    }
    return format(cursor, "MMMM yyyy");
  })();

  const goPrevious = () => {
    if (view === "Day") return setCursor(subDays(cursor, 1));
    if (view === "Week") return setCursor(subWeeks(cursor, 1));
    return setCursor(subMonths(cursor, 1));
  };

  const goNext = () => {
    if (view === "Day") return setCursor(addDays(cursor, 1));
    if (view === "Week") return setCursor(addWeeks(cursor, 1));
    return setCursor(addMonths(cursor, 1));
  };

  return (
    <AppShell
      title="Regional Calendar"
      action={<PrimaryButton onClick={() => setShowModal(true)}>New Event</PrimaryButton>}
    >
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            <button onClick={goPrevious} className="p-1.5 rounded-md hover:bg-muted">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="px-3 font-display font-semibold text-lg min-w-[180px] text-center">
              {viewLabel}
            </div>
            <button onClick={goNext} className="p-1.5 rounded-md hover:bg-muted">
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCursor(new Date())}
              className="ml-2 rounded-md border border-input bg-background px-3 py-1 text-xs hover:bg-muted"
            >
              Today
            </button>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <select
              value={filterOffice}
              onChange={(e) => setFilterOffice(e.target.value as OfficeCode | "All")}
              className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
            >
              <option value="All">All offices</option>
              {OFFICES.map((o) => (
                <option key={o.code} value={o.code}>
                  {o.name}
                </option>
              ))}
            </select>
            <div className="inline-flex rounded-md border border-input overflow-hidden">
              {(["Day", "Week", "Month", "Agenda"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 text-sm ${view === v ? "bg-accent text-accent-foreground" : "bg-background hover:bg-muted"}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-muted-foreground">Legend:</span>
          {OFFICES.map((o) => (
            <span key={o.code} className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: o.color }} />
              {o.name}
            </span>
          ))}
        </div>
      </div>

      {view === "Day" ? (
        <div className="mt-4 rounded-xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              {format(dayDate, "EEEE")}
            </div>
            <div className="font-display text-2xl font-semibold">{format(dayDate, "MMMM d")}</div>
          </div>
          <div className="divide-y divide-border">
            {dayEvents(dayDate).map((e) => (
              <button
                key={e.id}
                onClick={() => setSelected(e)}
                className="flex w-full items-start gap-4 p-4 text-left hover:bg-muted/40"
              >
                <div className="w-24 shrink-0 rounded-lg border border-border bg-muted/30 px-3 py-2 text-center">
                  <div className="text-sm font-semibold">{e.startTime}</div>
                  <div className="text-xs text-muted-foreground">{e.endTime}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{e.title}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {e.venue} · {e.type}
                  </div>
                  {e.description && (
                    <div className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {e.description}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <OfficeChip code={e.office} />
                  <StatusBadge status={e.status} />
                </div>
              </button>
            ))}
            {dayEvents(dayDate).length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No approved events for this day.
              </div>
            )}
          </div>
        </div>
      ) : view === "Week" ? (
        <div className="mt-4 rounded-xl border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border bg-muted/40">
            {weekDays.map((d) => {
              const today = isSameDay(d, new Date());
              return (
                <div
                  key={d.toISOString()}
                  className="border-l border-border px-3 py-3 first:border-l-0"
                >
                  <div className="text-xs uppercase text-muted-foreground">{format(d, "EEE")}</div>
                  <div
                    className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${today ? "bg-accent text-accent-foreground" : "text-foreground"}`}
                  >
                    {format(d, "d")}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-7">
            {weekDays.map((d) => {
              const evs = dayEvents(d);
              return (
                <div
                  key={d.toISOString()}
                  className="min-h-[360px] border-l border-border p-2 first:border-l-0"
                >
                  <div className="space-y-2">
                    {evs.map((e) => {
                      const m = officeMeta(e.office);
                      return (
                        <button
                          key={e.id}
                          onClick={() => setSelected(e)}
                          className="w-full rounded-lg px-2.5 py-2 text-left text-xs"
                          style={{
                            backgroundColor: `color-mix(in oklab, ${m.color} 18%, transparent)`,
                            color: m.color,
                            borderLeft: `3px solid ${m.color}`,
                          }}
                          title={e.title}
                        >
                          <div className="font-semibold">
                            {e.startTime} - {e.endTime}
                          </div>
                          <div className="mt-1 line-clamp-2 font-medium">{e.title}</div>
                          <div className="mt-1 line-clamp-1 opacity-80">{e.venue}</div>
                        </button>
                      );
                    })}
                    {evs.length === 0 && (
                      <div className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                        No events
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : view === "Month" ? (
        <div className="mt-4 rounded-xl border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-7 bg-muted/40 text-xs font-medium text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="px-3 py-2 text-center">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 auto-rows-[minmax(110px,1fr)]">
            {days.map((d) => {
              const inMonth = isSameMonth(d, cursor);
              const today = isSameDay(d, new Date());
              const evs = dayEvents(d);
              return (
                <div
                  key={d.toISOString()}
                  className={`border-t border-l border-border p-1.5 min-h-[110px] ${inMonth ? "bg-card" : "bg-muted/20"}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-medium ${today ? "bg-accent text-accent-foreground rounded-full h-5 w-5 flex items-center justify-center" : inMonth ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {format(d, "d")}
                    </span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {evs.slice(0, 3).map((e) => {
                      const m = officeMeta(e.office);
                      return (
                        <button
                          key={e.id}
                          onClick={() => setSelected(e)}
                          className="w-full text-left rounded px-1.5 py-0.5 text-[11px] font-medium truncate"
                          style={{
                            backgroundColor: `color-mix(in oklab, ${m.color} 18%, transparent)`,
                            color: m.color,
                            borderLeft: `3px solid ${m.color}`,
                          }}
                          title={e.title}
                        >
                          {e.startTime} {e.title}
                        </button>
                      );
                    })}
                    {evs.length > 3 && (
                      <div className="text-[10px] text-muted-foreground pl-1.5">
                        +{evs.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-border bg-card divide-y divide-border">
          {visibleEvents
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((e) => (
              <button
                key={e.id}
                onClick={() => setSelected(e)}
                className="w-full text-left p-4 flex items-center gap-4 hover:bg-muted/40"
              >
                <div className="w-14 text-center">
                  <div className="text-[10px] uppercase text-muted-foreground">
                    {format(parseISO(e.date), "MMM")}
                  </div>
                  <div className="font-display text-xl font-semibold">
                    {format(parseISO(e.date), "d")}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{e.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {e.startTime}–{e.endTime} · {e.venue} · {e.type}
                  </div>
                </div>
                <OfficeChip code={e.office} />
                <StatusBadge status={e.status} />
              </button>
            ))}
          {visibleEvents.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">No approved events.</div>
          )}
        </div>
      )}

      {showModal && <EventModal onClose={() => setShowModal(false)} onCreate={addEvent} />}
      {selected && <EventDetailModal event={selected} onClose={() => setSelected(null)} />}
    </AppShell>
  );
}

function EventModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (e: CalendarEvent) => void;
}) {
  const [form, setForm] = useState({
    title: "",
    office: "ORD" as OfficeCode,
    description: "",
    venue: "",
    date: new Date().toISOString().slice(0, 10),
    startTime: "09:00",
    endTime: "11:00",
    type: "Meeting",
    participants: "",
    requiresRD: false,
    organizer: "Office of the Regional Director",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.venue) return;
    const title =
      form.requiresRD && !form.title.startsWith("NMA – ") ? `NMA – ${form.title}` : form.title;
    onCreate({
      id: `e-${Date.now()}`,
      title,
      office: form.office,
      description: form.description,
      venue: form.venue,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      type: form.type,
      participants: form.participants,
      requiresRD: form.requiresRD,
      status: form.requiresRD ? "Pending RD Approval" : "Approved",
      organizer: form.organizer,
      createdAt: new Date().toISOString(),
    });
    onClose();
  };

  const ic = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

  return (
    <Modal onClose={onClose} title="New Event">
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-xs font-medium">Event Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={ic}
            placeholder="e.g., Regional Science Fair"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium">Organizing Office</label>
            <select
              value={form.office}
              onChange={(e) => setForm({ ...form, office: e.target.value as OfficeCode })}
              className={ic}
            >
              {OFFICES.map((o) => (
                <option key={o.code} value={o.code}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium">Event Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className={ic}
            >
              {[
                "Meeting",
                "Workshop",
                "Consultation",
                "Field Activity",
                "Training",
                "Planning",
                "Conference",
              ].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium">Venue / Location</label>
          <input
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
            className={ic}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={ic}
            />
          </div>
          <div>
            <label className="text-xs font-medium">Start</label>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              className={ic}
            />
          </div>
          <div>
            <label className="text-xs font-medium">End</label>
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              className={ic}
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium">Participants</label>
          <input
            value={form.participants}
            onChange={(e) => setForm({ ...form, participants: e.target.value })}
            className={ic}
            placeholder="e.g., Division chiefs, PSTO directors"
          />
        </div>
        <div>
          <label className="text-xs font-medium">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className={ic}
          />
        </div>
        <label className="flex items-start gap-3 rounded-md border border-border bg-muted/30 p-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.requiresRD}
            onChange={(e) => setForm({ ...form, requiresRD: e.target.checked })}
            className="mt-0.5 h-4 w-4"
          />
          <div>
            <div className="text-sm font-medium">For Regional Director Attendance</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Event will be submitted for RD approval. Title will be prefixed with{" "}
              <strong>NMA –</strong> and the event will only appear in the calendar after approval.
            </div>
          </div>
        </label>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
          >
            {form.requiresRD ? "Submit for Approval" : "Create Event"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function EventDetailModal({ event, onClose }: { event: CalendarEvent; onClose: () => void }) {
  return (
    <Modal onClose={onClose} title={event.title}>
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <OfficeChip code={event.office} withName />
          <StatusBadge status={event.status} />
          {event.requiresRD && (
            <span className="rounded-full bg-warning/15 text-[oklch(0.45_0.13_75)] px-2 py-0.5 text-xs font-medium">
              Requires RD
            </span>
          )}
        </div>
        <Row label="Date" value={format(parseISO(event.date), "PPPP")} />
        <Row label="Time" value={`${event.startTime} – ${event.endTime}`} />
        <Row label="Venue" value={event.venue} />
        <Row label="Type" value={event.type} />
        <Row label="Organizer" value={event.organizer} />
        {event.participants && <Row label="Participants" value={event.participants} />}
        {event.description && <Row label="Description" value={event.description} />}
      </div>
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      <div className="col-span-2">{value}</div>
    </div>
  );
}

function Modal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-xl bg-card border border-border shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card">
          <h3 className="font-display font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
