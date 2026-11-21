import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  tone = "gold",
}: {
  className?: string;
  tone?: "gold" | "navy";
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-8 items-center justify-center rounded-lg border",
        tone === "gold"
          ? "border-accent/40 bg-accent/12 text-accent"
          : "border-primary/20 bg-primary text-primary-foreground",
        className,
      )}
    >
      <Scale className="size-[18px]" strokeWidth={1.7} />
    </span>
  );
}

export function Wordmark({
  className,
  subtitle,
  tone = "light",
}: {
  className?: string;
  subtitle?: string;
  tone?: "light" | "dark";
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <BrandMark />
      <span className="min-w-0 leading-none">
        <span
          className={cn(
            "block text-[15px] font-semibold tracking-tight",
            tone === "light" ? "text-foreground" : "text-white",
          )}
        >
          LawyerOS
        </span>
        {subtitle ? (
          <span
            className={cn(
              "mt-1 block truncate text-[10.5px] font-medium uppercase tracking-[0.12em]",
              tone === "light" ? "text-muted-foreground" : "text-white/55",
            )}
          >
            {subtitle}
          </span>
        ) : null}
      </span>
    </span>
  );
}
