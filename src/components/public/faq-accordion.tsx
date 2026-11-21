"use client";

import { FAQS } from "@/lib/demo-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqAccordion() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="border-b border-border bg-background py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto grid max-w-[1440px] gap-7 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)] lg:gap-14 lg:px-10">
        <header>
          <h2
            id="faq-title"
            className="font-editorial text-[28px] font-medium text-foreground sm:text-[32px]"
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
            Practical answers before you call or book. If something is missing,
            the chamber will walk you through it at the first consultation.
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[10.5px] font-medium text-muted-foreground">
            Expand a question with Enter or Space
          </p>
        </header>

        <Accordion type="single" collapsible className="rounded-[12px] border border-border bg-card px-4 sm:px-5">
          {FAQS.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
