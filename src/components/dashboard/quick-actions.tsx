"use client";

import { CalendarPlus, FolderUp, Plus, Receipt } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ACTIONS = [
  {
    label: "Add Appointment",
    icon: CalendarPlus,
    href: "/dashboard/appointments?new=1",
  },
  { label: "New Case", icon: Plus, href: "/dashboard/cases?new=1" },
  { label: "Upload Document", icon: FolderUp, href: "/dashboard/documents?upload=1" },
  { label: "Record Payment", icon: Receipt, href: "/dashboard/billing?pay=1" },
];

export function QuickActions() {
  return (
    <section className="rounded-[12px] border border-border bg-card">
      <header className="border-b border-border px-4 py-3">
        <h2 className="text-[13.5px] font-semibold text-foreground">Quick Actions</h2>
      </header>
      <ul className="grid grid-cols-2 gap-2 p-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <li key={action.label}>
              <Link
                href={action.href}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1.5 rounded-[10px] border border-border bg-background px-2 py-4 text-center transition-colors",
                  "hover:border-primary/40 hover:bg-muted focus-visible:border-primary",
                )}
              >
                <Icon className="size-[18px] text-primary" strokeWidth={1.8} />
                <span className="text-[11.5px] font-medium text-foreground">
                  {action.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
