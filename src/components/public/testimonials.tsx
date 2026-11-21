"use client";

import { Quote, Star } from "lucide-react";
import { DEMO_TESTIMONIALS } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="border-b border-border bg-card py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="testimonials-title"
              className="font-editorial text-[28px] font-medium text-foreground sm:text-[32px]"
            >
              What Clients Say
            </h2>
            <p className="mt-1.5 text-[13px] text-muted-foreground">
              Representative feedback from the chamber&apos;s demo content.
            </p>
          </div>
          <p className="rounded-full border border-border bg-muted px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Demo data
          </p>
        </header>

        <ul className="-mx-4 mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {DEMO_TESTIMONIALS.map((item) => (
            <li
              key={item.id}
              className="min-w-[85%] snap-start rounded-[12px] border border-border bg-background p-4 sm:min-w-0 sm:p-5"
            >
              <div className="flex items-center justify-between">
                <Quote className="size-4 text-accent" />
                <div
                  className="flex items-center gap-0.5"
                  aria-label={`${item.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      aria-hidden
                      className={cn(
                        "size-3",
                        index < item.rating
                          ? "fill-accent text-accent"
                          : "text-border",
                      )}
                    />
                  ))}
                </div>
              </div>
              <blockquote className="mt-3">
                <p className="text-[13px] leading-relaxed text-foreground">
                  “{item.quote}”
                </p>
              </blockquote>
              <footer className="mt-4 flex items-center gap-2.5 border-t border-border pt-3">
                <span
                  aria-hidden
                  className="flex size-7 items-center justify-center rounded-full border border-border bg-muted text-[10px] font-semibold text-muted-foreground"
                >
                  {item.name.split(" ").slice(-1)}
                </span>
                <div className="leading-tight">
                  <p className="text-[12px] font-semibold text-foreground">
                    {item.name}
                  </p>
                  <p className="text-[10.5px] text-muted-foreground">
                    {item.role}
                  </p>
                </div>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
