import { officeMeta, type OfficeCode } from "@/lib/mock-data";

export function OfficeChip({ code, withName = false }: { code: OfficeCode; withName?: boolean }) {
  const m = officeMeta(code);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `color-mix(in oklab, ${m.color} 15%, transparent)`, color: m.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: m.color }} />
      {withName ? m.name : code}
    </span>
  );
}
