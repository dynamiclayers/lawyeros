"use client";

import { Menu, X, Search, CalendarPlus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/brand-mark";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { PresetSwitcher } from "@/components/theme/preset-switcher";
import { BookingStatusDialog } from "@/components/public/booking-status-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "#about", label: "About" },
  { href: "#practice-areas", label: "Practice Areas" },
  { href: "#credentials", label: "Credentials" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#faq", label: "FAQ" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) =>
      document.querySelector<HTMLElement>(item.href),
    ).filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.2, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const handleNav = useCallback((href: string) => {
    setOpen(false);
    const target = document.querySelector<HTMLElement>(href);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-white/10 bg-[#0F172A] transition-shadow duration-200 dark:bg-[#070C15]",
        scrolled && "shadow-[0_6px_24px_-18px_rgba(0,0,0,0.9)]",
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-16 lg:px-10">
        <Link href="/" className="flex items-center" aria-label="LawyerOS home">
          <Wordmark tone="dark" />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <button
                  type="button"
                  onClick={() => handleNav(item.href)}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 text-[12.5px] font-medium transition-colors",
                    active === item.href
                      ? "text-white"
                      : "text-white/65 hover:text-white",
                  )}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <div className="flex items-center rounded-lg border border-white/12 bg-white/[0.04] p-0.5">
            <ModeToggle compact className="border-0 bg-transparent p-0" />
          </div>
          <div className="[&_button]:border-white/12 [&_button]:bg-white/[0.04] [&_button]:text-white/80 [&_button]:hover:bg-white/[0.09]">
            <PresetSwitcher />
          </div>
          <Button
            size="sm"
            variant="accent"
            className="h-9 px-3.5"
            onClick={() => handleNav("#booking")}
          >
            Book Consultation
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setStatusOpen(true)}
            className="flex size-9 items-center justify-center rounded-md border border-white/12 text-white/75 transition-colors hover:text-white"
            aria-label="Track booking status"
          >
            <Search className="size-4" />
          </button>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="public-mobile-menu"
            className="flex size-9 items-center justify-center rounded-md border border-white/12 text-white/80 transition-colors hover:text-white"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="public-mobile-menu"
          className="border-t border-white/10 bg-[#0F172A] px-4 pb-5 pt-3 animate-enter-up lg:hidden dark:bg-[#070C15]"
        >
          <nav aria-label="Mobile primary">
            <ul className="grid gap-0.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => handleNav(item.href)}
                    className="w-full rounded-md px-2 py-2.5 text-left text-[13px] font-medium text-white/75 transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
            <div className="[&_button]:border-white/12 [&_button]:bg-white/[0.04] [&_button]:text-white/80">
              <ModeToggle compact />
            </div>
            <div className="[&_button]:border-white/12 [&_button]:bg-white/[0.04] [&_button]:text-white/80 [&_button]:hover:bg-white/[0.09]">
              <PresetSwitcher />
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <Button variant="accent" onClick={() => handleNav("#booking")}>
              <CalendarPlus className="size-4" />
              Book Consultation
            </Button>
            <Button
              variant="outline"
              className="border-white/15 bg-transparent text-white hover:bg-white/[0.08] hover:text-white"
              onClick={() => {
                setOpen(false);
                setStatusOpen(true);
              }}
            >
              <Search className="size-4" />
              Track Booking Status
            </Button>
          </div>
        </div>
      ) : null}

      <BookingStatusDialog open={statusOpen} onOpenChange={setStatusOpen} />
    </header>
  );
}
