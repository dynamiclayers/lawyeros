"use client";

import { BadgeCheck, Clock, GraduationCap, Landmark, MapPin } from "lucide-react";
import Image from "next/image";
import { useWorkspace } from "@/components/providers/workspace-provider";

export function AboutSection() {
  const { landing } = useWorkspace();

  const credentials = [
    { icon: GraduationCap, label: "Education", value: landing.education },
    { icon: BadgeCheck, label: "Bar Council", value: landing.barCouncil },
    { icon: Landmark, label: "Court Jurisdiction", value: landing.jurisdictions },
    { icon: Clock, label: "Chamber Hours", value: landing.chamberHours },
  ];

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="border-b border-border bg-background py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto grid max-w-[1440px] items-start gap-7 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-12 lg:px-10">
        <figure className="overflow-hidden rounded-[12px] border border-border bg-card">
          <Image
            src="/images/chamber.jpg"
            alt="Classical courthouse exterior with stone columns"
            width={1200}
            height={800}
            className="aspect-[4/3] w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 46vw"
          />
          <figcaption className="flex items-center gap-2 border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
            <MapPin className="size-3.5 text-accent" />
            The chamber is a short walk from the District Judge Court — image is
            illustrative.
          </figcaption>
        </figure>

        <div id="credentials">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
            The Chamber
          </p>
          <h2
            id="about-title"
            className="font-editorial mt-1.5 text-[28px] font-medium text-foreground sm:text-[32px]"
          >
            About Our Chamber
          </h2>
          <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-muted-foreground sm:text-[14px]">
            {landing.bio}
          </p>

          <dl className="mt-6 grid gap-x-6 gap-y-0 border-t border-border sm:grid-cols-2">
            {credentials.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-start gap-2.5 border-b border-border py-3.5 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
                >
                  <Icon className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.8} />
                  <div className="min-w-0">
                    <dt className="text-[11px] uppercase tracking-[0.07em] text-muted-foreground">
                      {item.label}
                    </dt>
                    <dd className="mt-0.5 text-[13px] font-medium text-foreground">
                      {item.value}
                    </dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
