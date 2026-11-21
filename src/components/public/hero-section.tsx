"use client";

import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarCheck,
  Search,
  Star,
  Timer,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { BookingStatusDialog } from "@/components/public/booking-status-dialog";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/components/providers/workspace-provider";

const METRICS = [
  { icon: Timer, value: "10+", label: "Years Experience" },
  { icon: BriefcaseBusiness, value: "500+", label: "Cases Resolved" },
  { icon: Star, value: "98%", label: "Client Satisfaction" },
];

export function HeroSection() {
  const { landing } = useWorkspace();
  const [statusOpen, setStatusOpen] = useState(false);

  function scrollToBooking() {
    document
      .querySelector("#booking")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section
      aria-labelledby="hero-title"
      className="relative border-b border-border bg-hero-wash"
    >
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.86fr)] lg:gap-14 lg:px-10 lg:py-16">
        <div className="flex flex-col justify-center lg:max-w-[560px]">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-card px-3 py-1 text-[11.5px] font-semibold text-accent">
            <BadgeCheck className="size-3.5" strokeWidth={2} />
            Bar Council Enrolled
          </div>

          <h1
            id="hero-title"
            className="font-editorial mt-5 text-[34px] leading-[1.1] font-medium text-foreground text-balance sm:text-[42px] lg:text-[54px]"
          >
            Expert Legal Support
            <br className="hidden sm:block" /> You Can Trust
          </h1>

          <p className="mt-4 max-w-[460px] text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
            Professional legal services with integrity, experience and
            dedication — from first consultation to final decree, with a clear
            record of every step.
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button variant="accent" className="h-11 justify-between gap-3" onClick={scrollToBooking}>
              Schedule a Consultation
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="h-11 border-accent/40 text-accent hover:border-accent/60 hover:bg-accent/8 hover:text-accent"
              onClick={() => setStatusOpen(true)}
            >
              Track Booking Status
              <Search className="size-4" />
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-border pt-5">
            {METRICS.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="flex items-center gap-2.5">
                  <Icon className="size-4 text-accent" strokeWidth={1.8} />
                  <div className="leading-tight">
                    <p className="text-[15px] font-semibold text-foreground">
                      {metric.value}
                    </p>
                    <p className="text-[11.5px] text-muted-foreground">
                      {metric.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-[12px] border border-border bg-card shadow-surface">
            <Image
              src={landing.photo}
              alt={`Portrait of ${landing.lawyerName}`}
              width={900}
              height={1350}
              priority
              className="aspect-[4/5] w-full object-cover object-top sm:aspect-[5/5] lg:aspect-[4/4.5]"
              sizes="(max-width: 1024px) 100vw, 44vw"
            />
          </div>

          <div className="absolute right-3 top-4 flex flex-col gap-2 sm:right-4">
            <div className="flex items-center gap-2.5 rounded-[10px] border border-border bg-card px-3 py-2 shadow-surface">
              <CalendarCheck className="size-4 text-accent" strokeWidth={1.8} />
              <div className="leading-tight">
                <p className="text-[14px] font-semibold text-foreground">10+</p>
                <p className="text-[10.5px] text-muted-foreground">Years</p>
                <p className="text-[10.5px] text-muted-foreground">Experience</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-[10px] border border-border bg-card px-3 py-2 shadow-surface">
              <BriefcaseBusiness
                className="size-4 text-accent"
                strokeWidth={1.8}
              />
              <div className="leading-tight">
                <p className="text-[14px] font-semibold text-foreground">500+</p>
                <p className="text-[10.5px] text-muted-foreground">Cases</p>
                <p className="text-[10.5px] text-muted-foreground">Resolved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingStatusDialog open={statusOpen} onOpenChange={setStatusOpen} />
    </section>
  );
}
