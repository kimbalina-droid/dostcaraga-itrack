import { cn } from "@/lib/utils";
import type { DocStatus } from "@/lib/mock-data";

const STATUS_STYLES: Record<string, string> = {
  Received: "bg-info/10 text-info border-info/30",
  Routed: "bg-accent/10 text-accent border-accent/30",
  Ongoing: "bg-warning/15 text-warning-foreground border-warning/40",
  Pending: "bg-warning/15 text-[oklch(0.5_0.13_75)] border-warning/40",
  "For Approval": "bg-[oklch(0.94_0.05_295)] text-[oklch(0.4_0.18_295)] border-[oklch(0.55_0.2_295)]/30",
  Approved: "bg-success/10 text-success border-success/40",
  Released: "bg-success/15 text-success border-success/40",
  Closed: "bg-muted text-muted-foreground border-border",
  Draft: "bg-muted text-muted-foreground border-border",
  Submitted: "bg-info/10 text-info border-info/30",
  "Pending RD Approval": "bg-warning/15 text-[oklch(0.45_0.13_75)] border-warning/40",
  Declined: "bg-destructive/10 text-destructive border-destructive/30",
  Completed: "bg-success/10 text-success border-success/40",
  Cancelled: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status }: { status: DocStatus | string }) {
  const cls = STATUS_STYLES[status] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", cls)}>
      {status}
    </span>
  );
}
