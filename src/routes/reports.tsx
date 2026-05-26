import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useStore } from "@/lib/store";
import { OFFICES, DOC_STATUSES, type DocumentRecord } from "@/lib/mock-data";
import { format, parseISO, subDays, eachDayOfInterval } from "date-fns";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Download, Printer, FileSpreadsheet } from "lucide-react";

function getProcessingHours(document: DocumentRecord) {
  const timestamps = document.timeline
    .map((entry) => Date.parse(entry.at))
    .filter((value) => !Number.isNaN(value))
    .sort((a, b) => a - b);

  if (timestamps.length === 0) {
    const created = Date.parse(document.createdAt);
    return Number.isNaN(created) ? 0 : 0;
  }

  const start = timestamps[0];
  const end = timestamps[timestamps.length - 1];
  return Math.max(0, (end - start) / (1000 * 60 * 60));
}

function formatProcessingTime(hours: number) {
  if (hours <= 0) return "-";
  if (hours < 24) return `${Math.round(hours * 10) / 10} hrs`;

  const days = Math.floor(hours / 24);
  const remainingHours = Math.round((hours % 24) * 10) / 10;

  if (remainingHours === 0) return `${days} day${days === 1 ? "" : "s"}`;
  return `${days} day${days === 1 ? "" : "s"} ${remainingHours} hrs`;
}

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics - DOST Caraga DTS" },
      { name: "description", content: "Document and activity analytics." },
    ],
  }),
  component: Reports,
});

function Reports() {
  const { documents } = useStore();

  const last30 = eachDayOfInterval({ start: subDays(new Date(), 13), end: new Date() }).map((d) => ({
    day: format(d, "MMM d"),
    received: documents.filter((doc) => format(parseISO(doc.createdAt), "yyyy-MM-dd") === format(d, "yyyy-MM-dd")).length,
  }));

  const byStatus = DOC_STATUSES.map((s) => ({
    name: s,
    value: documents.filter((d) => d.status === s).length,
  })).filter((s) => s.value > 0);

  const byOffice = OFFICES.map((o) => {
    const officeDocuments = documents.filter((d) => d.receivingOffice === o.code);
    const processingTimes = officeDocuments.map(getProcessingHours);
    const averageProcessingHours = processingTimes.length
      ? processingTimes.reduce((sum, value) => sum + value, 0) / processingTimes.length
      : 0;

    return {
      office: o.name,
      code: o.code,
      received: officeDocuments.length,
      color: o.color,
      averageProcessingHours,
    };
  });

  const completed = documents.filter((d) => d.status === "Released" || d.status === "Closed").length;
  const pending = documents.filter((d) => d.status === "Pending" || d.status === "For Approval").length;
  const avgTurnaround = "2.3 days";

  const chartColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

  return (
    <AppShell
      title="Reports & Analytics"
      action={
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-muted">
            <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-muted">
            <Download className="h-3.5 w-3.5" /> PDF
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-muted">
            <Printer className="h-3.5 w-3.5" /> Print
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Documents", value: documents.length },
          { label: "Completed / Released", value: completed },
          { label: "Pending", value: pending },
          { label: "Avg. Turnaround", value: avgTurnaround },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <div className="text-sm text-muted-foreground">{s.label}</div>
            <div className="mt-2 text-3xl font-display font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <h3 className="font-display font-semibold">Documents Received (last 14 days)</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last30} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="received" stroke="var(--accent)" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display font-semibold">Status Distribution</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {byStatus.map((_, i) => (
                    <Cell key={i} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border p-5">
          <h3 className="font-display font-semibold">Documents per Office</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Office / Division</th>
              <th className="px-5 py-3 font-medium">Documents Received</th>
              <th className="px-5 py-3 font-medium">Avg. Processing Time</th>
              <th className="px-5 py-3 font-medium">Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {byOffice.map((o) => {
              const pct = documents.length ? Math.round((o.received / documents.length) * 100) : 0;
              return (
                <tr key={o.code}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: o.color }} />
                      {o.office}
                    </div>
                  </td>
                  <td className="px-5 py-3 font-medium">{o.received}</td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {formatProcessingTime(o.averageProcessingHours)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-40 overflow-hidden rounded-full bg-muted">
                        <div className="h-full" style={{ width: `${pct}%`, backgroundColor: o.color }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
