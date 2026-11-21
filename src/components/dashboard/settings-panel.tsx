"use client";

import {
  Check,
  CircleCheck,
  ExternalLink,
  Image as ImageIcon,
  Palette,
  RotateCcw,
  Save,
  SlidersHorizontal,
  Sun,
} from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { PresetSwitcher } from "@/components/theme/preset-switcher";
import { useBrandPreset } from "@/components/theme/theme-provider";
import { PageHeading } from "@/components/dashboard/page-heading";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { THEME_PRESETS } from "@/lib/theme-presets";
import { formatBDT } from "@/lib/utils";
import type { LandingSettings } from "@/types";

const WEEKDAYS = [
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
  { value: 0, label: "Sun" },
];

const SLOT_OPTIONS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

export function SettingsPanel() {
  const { landing, saveLanding, visitor, saveVisitorPreferences } = useWorkspace();
  const { preset } = useBrandPreset();
  const { theme } = useTheme();
  const [draft, setDraft] = useState<LandingSettings>(landing);
  const [visitorMode, setVisitorMode] = useState(visitor.defaultMode);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    setDraft(landing);
  }, [landing]);

  function update<K extends keyof LandingSettings>(key: K, value: LandingSettings[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleSave() {
    const next: Record<string, string> = {};
    if (draft.lawyerName.trim().length < 3) next.lawyerName = "Enter the lawyer's name.";
    if (draft.lawyerTitle.trim().length < 3) next.lawyerTitle = "Enter a title.";
    if (draft.bio.trim().length < 20) next.bio = "Add a short biography (20+ characters).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(draft.email.trim())) {
      next.email = "Enter a valid contact email.";
    }
    if (draft.phone.trim().length < 8) next.phone = "Enter a contact phone number.";
    if (draft.address.trim().length < 8) next.address = "Enter the chamber address.";
    if (draft.feeInChamber <= 0) next.feeInChamber = "Fee must be greater than zero.";
    if (draft.feeOnline <= 0) next.feeOnline = "Fee must be greater than zero.";
    if (draft.bookingDays.length === 0) next.bookingDays = "Select at least one day.";
    if (draft.bookingSlots.length === 0) next.bookingSlots = "Select at least one slot.";
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error("Fix the highlighted fields before saving");
      return;
    }

    setSaving(true);
    setTimeout(() => {
      saveLanding(draft);
      saveVisitorPreferences({ defaultMode: visitorMode, preset });
      setSaving(false);
      setSavedAt(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
      toast.success("Chamber settings saved");
    }, 500);
  }

  function handleReset() {
    setDraft(landing);
    setErrors({});
    setSavedAt(null);
    toast.message("Unsaved edits discarded");
  }

  return (
    <div className="space-y-4">
      <PageHeading
        title="Settings"
        description="Appearance, visitor defaults, and the content shown on the public site."
        actions={
          <Button
            size="sm"
            variant="outline"
            asChild
          >
            <a href="/" target="_blank" rel="noreferrer">
              <ExternalLink className="size-3.5" />
              Open public site
            </a>
          </Button>
        }
      />

      <section className="rounded-[12px] border border-border bg-card">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
          <div>
            <h2 className="flex items-center gap-2 text-[13.5px] font-semibold text-foreground">
              <Palette className="size-4 text-accent" />
              Appearance
            </h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Applies to both the public site and this workspace.
            </p>
          </div>
          {savedAt ? (
            <Badge variant="success">
              <CircleCheck className="size-2.5" />
              Saved {savedAt}
            </Badge>
          ) : null}
        </header>

        <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
          <div className="space-y-4">
            <div>
              <p className="text-[11.5px] font-semibold text-foreground">Brand preset</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Choose the chamber palette. Applied instantly across the app.
              </p>
              <div className="mt-2">
                <PresetSwitcher variant="swatches" />
              </div>
            </div>

            <div>
              <p className="text-[11.5px] font-semibold text-foreground">
                Visitor default mode
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                What new visitors see on the public site before choosing a mode.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {(["light", "dark", "system"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={visitorMode === mode}
                    onClick={() => setVisitorMode(mode)}
                    className={
                      visitorMode === mode
                        ? "rounded-lg border border-accent bg-accent/8 px-3 py-1.5 text-[11.5px] font-medium text-accent"
                        : "rounded-lg border border-border px-3 py-1.5 text-[11.5px] text-foreground transition-colors hover:bg-muted"
                    }
                  >
                    {mode === "light" ? "Light" : mode === "dark" ? "Dark" : "System"}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[10px] border border-border bg-muted/40 p-3">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
                <Sun className="size-3.5 text-accent" />
                Your current mode
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Switch this workspace with the control below. The visitor default
                above only applies to new client sessions.
              </p>
              <div className="mt-2">
                <ModeToggle />
              </div>
            </div>
          </div>

          <div className="rounded-[10px] border border-border bg-background p-3">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Live preview
            </p>
            <div className="mt-2 rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="size-2 rounded-full bg-accent"
                />
                <span className="text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground">
                  Public header
                </span>
              </div>
              <div className="mt-2 rounded-md bg-primary px-2.5 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-primary-foreground">
                    LawyerOS
                  </span>
                  <span className="rounded bg-accent px-1.5 py-0.5 text-[8.5px] font-semibold text-accent-foreground">
                    Book
                  </span>
                </div>
              </div>
              <p className="mt-2 font-editorial text-[15px] leading-tight text-foreground">
                Expert Legal Support You Can Trust
              </p>
              <p className="mt-1 text-[9.5px] leading-snug text-muted-foreground">
                Navy surfaces, muted gold accents, warm off-white background.
              </p>
              <div className="mt-2 flex gap-1">
                <span className="rounded bg-primary px-2 py-1 text-[9px] font-semibold text-primary-foreground">
                  Primary
                </span>
                <span className="rounded bg-accent px-2 py-1 text-[9px] font-semibold text-accent-foreground">
                  Accent
                </span>
                <span className="rounded border border-border px-2 py-1 text-[9px] text-foreground">
                  Border
                </span>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">
              Mode: {theme ?? "system"} · Preset:{" "}
              {THEME_PRESETS.find((item) => item.id === preset)?.name}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[12px] border border-border bg-card">
        <header className="border-b border-border px-4 py-3">
          <h2 className="flex items-center gap-2 text-[13.5px] font-semibold text-foreground">
            <SlidersHorizontal className="size-4 text-accent" />
            Landing page content
          </h2>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            These fields populate the public hero, about, and booking sections.
          </p>
        </header>

        <div className="grid gap-5 p-4 lg:grid-cols-2">
          <div className="space-y-3">
            <div>
              <Label htmlFor="set-name">Lawyer name</Label>
              <Input
                id="set-name"
                className="mt-1.5"
                value={draft.lawyerName}
                aria-invalid={Boolean(errors.lawyerName)}
                onChange={(event) => update("lawyerName", event.target.value)}
              />
              {errors.lawyerName ? (
                <p role="alert" className="mt-1 text-[11px] text-destructive">
                  {errors.lawyerName}
                </p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="set-title">Professional title</Label>
              <Input
                id="set-title"
                className="mt-1.5"
                value={draft.lawyerTitle}
                aria-invalid={Boolean(errors.lawyerTitle)}
                onChange={(event) => update("lawyerTitle", event.target.value)}
              />
              {errors.lawyerTitle ? (
                <p role="alert" className="mt-1 text-[11px] text-destructive">
                  {errors.lawyerTitle}
                </p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="set-bio">Short biography</Label>
              <Textarea
                id="set-bio"
                rows={4}
                className="mt-1.5"
                value={draft.bio}
                aria-invalid={Boolean(errors.bio)}
                onChange={(event) => update("bio", event.target.value)}
              />
              {errors.bio ? (
                <p role="alert" className="mt-1 text-[11px] text-destructive">
                  {errors.bio}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="set-photo">Profile photo path</Label>
              <div className="mt-1.5 flex items-start gap-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                  {draft.photo ? (
                    <Image
                      src={draft.photo}
                      alt="Profile preview"
                      width={64}
                      height={64}
                      className="size-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center text-muted-foreground">
                      <ImageIcon className="size-5" />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Input
                    id="set-photo"
                    value={draft.photo}
                    onChange={(event) => update("photo", event.target.value)}
                    className="font-mono text-[11px]"
                  />
                  <div className="mt-1.5 flex gap-1.5">
                    {["/images/lawyer-portrait.jpg", "/images/chamber.jpg"].map((src) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => update("photo", src)}
                        className="rounded-md border border-border px-2 py-1 text-[10px] text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                      >
                        {src.split("/").pop()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-1 text-[10.5px] text-muted-foreground">
                Demo uses bundled images. A production deployment should accept a
                real upload.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="set-education">Education</Label>
                <Input
                  id="set-education"
                  className="mt-1.5"
                  value={draft.education}
                  onChange={(event) => update("education", event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="set-bar">Bar Council</Label>
                <Input
                  id="set-bar"
                  className="mt-1.5"
                  value={draft.barCouncil}
                  onChange={(event) => update("barCouncil", event.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="set-jurisdiction">Court jurisdictions</Label>
              <Input
                id="set-jurisdiction"
                className="mt-1.5"
                value={draft.jurisdictions}
                onChange={(event) => update("jurisdictions", event.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="set-hours">Chamber hours</Label>
              <Input
                id="set-hours"
                className="mt-1.5"
                value={draft.chamberHours}
                onChange={(event) => update("chamberHours", event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="set-fee-chamber">In-chamber fee (৳)</Label>
                <Input
                  id="set-fee-chamber"
                  type="number"
                  min={1}
                  className="mt-1.5"
                  value={draft.feeInChamber}
                  aria-invalid={Boolean(errors.feeInChamber)}
                  onChange={(event) =>
                    update("feeInChamber", Number(event.target.value))
                  }
                />
                {errors.feeInChamber ? (
                  <p role="alert" className="mt-1 text-[11px] text-destructive">
                    {errors.feeInChamber}
                  </p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="set-fee-online">Online fee (৳)</Label>
                <Input
                  id="set-fee-online"
                  type="number"
                  min={1}
                  className="mt-1.5"
                  value={draft.feeOnline}
                  aria-invalid={Boolean(errors.feeOnline)}
                  onChange={(event) => update("feeOnline", Number(event.target.value))}
                />
                {errors.feeOnline ? (
                  <p role="alert" className="mt-1 text-[11px] text-destructive">
                    {errors.feeOnline}
                  </p>
                ) : null}
              </div>
            </div>

            <div>
              <p className="text-[12px] font-semibold text-foreground">Available booking days</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {WEEKDAYS.map((day) => {
                  const selected = draft.bookingDays.includes(day.value);
                  return (
                    <button
                      key={day.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        update(
                          "bookingDays",
                          selected
                            ? draft.bookingDays.filter((value) => value !== day.value)
                            : [...draft.bookingDays, day.value],
                        )
                      }
                      className={
                        selected
                          ? "rounded-md border border-accent bg-accent/8 px-2.5 py-1 text-[11px] font-medium text-accent"
                          : "rounded-md border border-border px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted"
                      }
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
              {errors.bookingDays ? (
                <p role="alert" className="mt-1 text-[11px] text-destructive">
                  {errors.bookingDays}
                </p>
              ) : null}
            </div>

            <div>
              <p className="text-[12px] font-semibold text-foreground">Time slots</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {SLOT_OPTIONS.map((slot) => {
                  const selected = draft.bookingSlots.includes(slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        update(
                          "bookingSlots",
                          selected
                            ? draft.bookingSlots.filter((value) => value !== slot)
                            : [...draft.bookingSlots, slot].sort(),
                        )
                      }
                      className={
                        selected
                          ? "rounded-md border border-accent bg-accent/8 px-2.5 py-1 text-[11px] font-medium text-accent"
                          : "rounded-md border border-border px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted"
                      }
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              {errors.bookingSlots ? (
                <p role="alert" className="mt-1 text-[11px] text-destructive">
                  {errors.bookingSlots}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="set-phone">Contact phone</Label>
              <Input
                id="set-phone"
                className="mt-1.5"
                value={draft.phone}
                aria-invalid={Boolean(errors.phone)}
                onChange={(event) => update("phone", event.target.value)}
              />
              {errors.phone ? (
                <p role="alert" className="mt-1 text-[11px] text-destructive">
                  {errors.phone}
                </p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="set-email">Contact email</Label>
              <Input
                id="set-email"
                type="email"
                className="mt-1.5"
                value={draft.email}
                aria-invalid={Boolean(errors.email)}
                onChange={(event) => update("email", event.target.value)}
              />
              {errors.email ? (
                <p role="alert" className="mt-1 text-[11px] text-destructive">
                  {errors.email}
                </p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="set-address">Chamber address</Label>
              <Textarea
                id="set-address"
                rows={2}
                className="mt-1.5"
                value={draft.address}
                aria-invalid={Boolean(errors.address)}
                onChange={(event) => update("address", event.target.value)}
              />
              {errors.address ? (
                <p role="alert" className="mt-1 text-[11px] text-destructive">
                  {errors.address}
                </p>
              ) : null}
            </div>
            <p className="rounded-[10px] border border-border bg-muted/40 px-3 py-2 text-[10.5px] leading-relaxed text-muted-foreground">
              Demo guidance: do not publish a real address, phone number, or
              professional credential until the chamber configures them. Current
              values are placeholders.
            </p>
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3">
          <p className="text-[11px] text-muted-foreground">
            Preferences persist in this browser. In production these values belong
            in the chamber database.
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} disabled={saving}>
              <RotateCcw className="size-3.5" />
              Reset
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <span className="size-3 animate-spin rounded-full border border-primary-foreground/40 border-t-transparent" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="size-3.5" />
                  Save changes
                </>
              )}
            </Button>
          </div>
        </footer>
      </section>

      <div className="rounded-[12px] border border-border bg-card px-4 py-3">
        <p className="flex items-center gap-2 text-[11.5px] font-semibold text-foreground">
          <Check className="size-3.5 text-success" />
          Fees currently published: {formatBDT(draft.feeInChamber)} in-chamber ·{" "}
          {formatBDT(draft.feeOnline)} online
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Visitors see these amounts in the booking wizard and footer. Selected
          preset: {THEME_PRESETS.find((item) => item.id === preset)?.name}.
        </p>
      </div>
    </div>
  );
}
