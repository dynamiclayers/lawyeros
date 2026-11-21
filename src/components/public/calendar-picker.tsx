"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function toKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function startOfGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const weekday = (first.getDay() + 6) % 7;
  return new Date(year, month, 1 - weekday);
}

export function CalendarPicker({
  value,
  onChange,
  availableDays,
  minDate,
}: {
  value: string | null;
  onChange: (date: string) => void;
  availableDays: number[];
  minDate?: string;
}) {
  const today = new Date();
  const [cursor, setCursor] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
  }));

  const cells = useMemo(() => {
    const start = startOfGrid(cursor.year, cursor.month);
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [cursor]);

  const todayKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());
  const min = minDate ?? todayKey;

  function move(delta: number) {
    setCursor((current) => {
      const next = new Date(current.year, current.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }

  const canGoBack =
    cursor.year > today.getFullYear() ||
    (cursor.year === today.getFullYear() && cursor.month > today.getMonth());

  return (
    <div className="rounded-[10px] border border-border bg-background p-3">
      <div className="flex items-center justify-between gap-2">
        <p aria-live="polite" className="text-[12.5px] font-semibold text-foreground">
          {MONTHS[cursor.month]} {cursor.year}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={!canGoBack}
            aria-label="Previous month"
            className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next month"
            className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>

      <div aria-hidden className="mt-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <span
            key={day}
            className="py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
          >
            {day}
          </span>
        ))}
      </div>

      <div role="grid" aria-label="Available consultation dates" className="grid grid-cols-7 gap-1">
        {cells.map((date) => {
          const key = toKey(date.getFullYear(), date.getMonth(), date.getDate());
          const inMonth = date.getMonth() === cursor.month;
          const weekday = date.getDay();
          const isAvailable =
            inMonth && availableDays.includes(weekday) && key >= min;
          const selected = value === key;

          return (
            <button
              key={key}
              type="button"
              role="gridcell"
              disabled={!isAvailable}
              aria-selected={selected}
              aria-label={date.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              onClick={() => onChange(key)}
              className={cn(
                "flex h-8 items-center justify-center rounded-md text-[11.5px] font-medium transition-colors",
                !inMonth && "text-muted-foreground/30",
                inMonth && !isAvailable && "text-muted-foreground/35",
                isAvailable && "text-foreground hover:bg-muted",
                selected && "bg-primary text-primary-foreground hover:bg-primary",
                key === todayKey && !selected && "ring-1 ring-accent/45",
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <p className="mt-2 border-t border-border pt-2 text-[10.5px] text-muted-foreground">
        Available weekdays are enabled. The chamber confirms all requests by
        phone or email.
      </p>
    </div>
  );
}
