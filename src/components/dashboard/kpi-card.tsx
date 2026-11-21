import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  icon: Icon,
  trend,
  sub,
  tone = "primary",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; positive?: boolean };
  sub?: string;
  tone?: "primary" | "accent" | "success";
}) {
  const iconTone = {
    primary: "border-border bg-muted text-primary",
    accent: "border-accent/25 bg-accent/8 text-accent",
    success: "border-success/25 bg-success/8 text-success",
  }[tone];

  return (
    <div className="rounded-[12px] border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className={cn(
            "flex size-7 items-center justify-center rounded-md border",
            iconTone,
          )}
        >
          <Icon className="size-3.5" strokeWidth={1.9} />
        </span>
        <p className="text-[11.5px] font-medium text-muted-foreground">{label}</p>
      </div>
      <div className="mt-3 flex flex-wrap items-end gap-x-2 gap-y-1">
        <p className="text-[26px] font-semibold leading-none tracking-tight text-foreground sm:text-[28px]">
          {value}
        </p>
        {trend ? (
          <p
            className={cn(
              "flex items-center gap-0.5 text-[11px] font-semibold",
              trend.positive === false ? "text-muted-foreground" : "text-success",
            )}
          >
            <ArrowUpRight className="size-3" strokeWidth={2.4} />
            {trend.value}
          </p>
        ) : null}
        {sub ? (
          <p className="ml-auto text-[10.5px] text-muted-foreground">{sub}</p>
        ) : null}
      </div>
    </div>
  );
}
