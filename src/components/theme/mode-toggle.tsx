"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ModeToggle({
  variant = "segmented",
  compact = false,
  className,
}: {
  variant?: "segmented" | "compact";
  compact?: boolean;
  className?: string;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const active = OPTIONS.find((option) => option.value === theme) ?? OPTIONS[2];
  const isCompact = compact || variant === "compact";

  if (!mounted) {
    return (
      <div
        aria-hidden
        className={cn(
          "h-9 rounded-lg border border-border bg-card",
          isCompact ? "w-[104px]" : "w-[260px]",
          className,
        )}
      />
    );
  }

  if (isCompact) {
    return (
      <div
        role="group"
        aria-label="Color mode"
        className={cn(
          "flex w-fit items-center gap-0.5 rounded-lg border border-border bg-card p-0.5",
          className,
        )}
      >
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = active.value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-label={`${option.label} mode`}
              aria-pressed={isActive}
              title={`${option.label} mode`}
              onClick={() => setTheme(option.value)}
              className={cn(
                "flex size-8 items-center justify-center rounded-md transition-colors",
                isActive
                  ? "bg-accent/15 text-accent"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("inline-flex flex-col gap-2", className)}>
      <div
        role="group"
        aria-label="Color mode"
        className="flex items-center gap-1 rounded-lg border border-border bg-card p-1"
      >
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = active.value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => setTheme(option.value)}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-md px-3 text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
