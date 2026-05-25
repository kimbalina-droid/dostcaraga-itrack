import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  seedDocuments,
  seedEvents,
  type CalendarEvent,
  type DocumentRecord,
  type EventStatus,
  type TimelineEntry,
} from "./mock-data";

interface StoreCtx {
  documents: DocumentRecord[];
  events: CalendarEvent[];
  addDocument: (d: DocumentRecord) => void;
  updateDocument: (id: string, patch: Partial<DocumentRecord>) => void;
  appendTimeline: (id: string, entry: TimelineEntry) => void;
  addEvent: (e: CalendarEvent) => void;
  setEventStatus: (id: string, status: EventStatus) => void;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<DocumentRecord[]>(seedDocuments);
  const [events, setEvents] = useState<CalendarEvent[]>(seedEvents);

  const value = useMemo<StoreCtx>(
    () => ({
      documents,
      events,
      addDocument: (d) => setDocuments((prev) => [d, ...prev]),
      updateDocument: (id, patch) =>
        setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d))),
      appendTimeline: (id, entry) =>
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === id
              ? { ...d, timeline: [...d.timeline, entry], status: entry.status ?? d.status }
              : d,
          ),
        ),
      addEvent: (e) => setEvents((prev) => [e, ...prev]),
      setEventStatus: (id, status) =>
        setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e))),
    }),
    [documents, events],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used within StoreProvider");
  return v;
}
