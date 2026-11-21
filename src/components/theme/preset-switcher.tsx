"use client";

import { Check, ChevronDown, Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { THEME_PRESETS, getPreset } from "@/lib/theme-presets";
import { cn } from "@/lib/utils";
import { useBrandPreset } from "@/components/theme/theme-provider";

export function PresetSwatch({
  primary,
  accent,
  className,
}: {
  primary: string;
  accent: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-5 shrink-0 overflow-hidden rounded-[4px] border border-border",
        className,
      )}
      style={{ background: primary }}
    >
      <span className="mt-auto h-2 w-full" style={{ background: accent }} />
    </span>
  );
}

export function PresetSwitcher({
  variant = "dropdown",
  className,
}: {
  variant?: "dropdown" | "swatches";
  className?: string;
}) {
  const { preset, setPreset } = useBrandPreset();
  const active = getPreset(preset);

  if (variant === "swatches") {
    return (
      <fieldset className={className}>
        <legend className="sr-only">Brand preset</legend>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {THEME_PRESETS.map((option) => {
            const selected = option.id === preset;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setPreset(option.id)}
                className={cn(
                  "group flex items-center gap-3 rounded-[10px] border bg-card p-3 text-left transition-colors",
                  selected
                    ? "border-accent ring-1 ring-accent"
                    : "border-border hover:border-primary/40",
                )}
              >
                <span
                  aria-hidden
                  className="flex size-10 shrink-0 flex-col overflow-hidden rounded-md border border-border"
                  style={{ background: option.primary }}
                >
                  <span className="mt-auto h-3 w-full" style={{ background: option.accent }} />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold text-foreground">
                    {option.name}
                    {selected ? <Check className="size-3.5 text-accent" /> : null}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                    {option.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-2.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted",
          className,
        )}
        aria-label={`Brand preset: ${active.name}`}
      >
        <Palette className="size-4 text-muted-foreground" />
        <span className="hidden xl:inline">{active.name}</span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Brand preset</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {THEME_PRESETS.map((option) => (
          <DropdownMenuItem
            key={option.id}
            onSelect={() => setPreset(option.id)}
            className="gap-2.5"
          >
            <PresetSwatch primary={option.primary} accent={option.accent} />
            <span className="flex-1 text-[13px]">{option.name}</span>
            {option.id === preset ? (
              <Check className="size-3.5 text-accent" />
            ) : (
              <span className="size-3.5" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
