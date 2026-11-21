"use client";

import {
  ArrowUpRight,
  Building2,
  Briefcase,
  Laptop,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PRACTICE_AREAS } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const ICONS = { Scale, ShieldCheck, Briefcase, Users, Building2, Laptop } as const;

const AREA_TARGETS: Record<string, string> = {
  civil: "Civil disputes, injunctions, and decree enforcement",
  criminal: "Bail, trial defence, and appeal briefing",
  corporate: "Incorporation, contracts, and compliance",
  family: "Separation, maintenance, and guardianship",
  property: "Title verification, partition, and registration",
  cyber: "Data protection, platform liability, and IP",
};

export function PracticeAreaGrid() {
  return (
    <section
      id="practice-areas"
      aria-labelledby="practice-title"
      className="border-b border-border bg-card py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <header className="mx-auto max-w-2xl text-center">
          <h2
            id="practice-title"
            className="font-editorial text-[28px] font-medium text-foreground sm:text-[32px]"
          >
            Our Practice Areas
          </h2>
          <p className="mt-2 text-[13.5px] text-muted-foreground">
            Comprehensive legal services across multiple domains
          </p>
        </header>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRACTICE_AREAS.map((area) => {
            const Icon = ICONS[area.icon as keyof typeof ICONS];
            return (
              <li key={area.id}>
                <a
                  href="#booking"
                  className={cn(
                    "group flex h-full items-start gap-3 rounded-[12px] border border-border bg-background p-4 transition-colors",
                    "hover:border-primary focus-visible:border-primary",
                    "sm:p-5",
                  )}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-accent/8 text-accent">
                    <Icon className="size-[17px]" strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[14px] font-semibold text-foreground">
                        {area.title}
                      </span>
                      <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
                    </span>
                    <span className="mt-1 block text-[12.5px] leading-relaxed text-muted-foreground">
                      {area.description}
                    </span>
                    <span className="mt-1.5 block text-[11px] text-muted-foreground/80">
                      {AREA_TARGETS[area.id]}
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
