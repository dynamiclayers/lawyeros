"use client";

import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { CHAMBER } from "@/lib/demo-data";

const QUICK_LINKS = [
  { href: "#about", label: "About" },
  { href: "#practice-areas", label: "Practice Areas" },
  { href: "#credentials", label: "Credentials" },
  { href: "#faq", label: "FAQ" },
];

export function PublicFooter() {
  const { landing } = useWorkspace();

  return (
    <footer className="bg-[#0F172A] text-white/70 dark:bg-[#070C15]">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,0.7fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <BrandMark />
              <div className="leading-tight">
                <p className="text-[14px] font-semibold text-white">
                  LawyerOS
                </p>
                <p className="text-[11px] text-white/50">
                  {CHAMBER.chamberName}
                </p>
              </div>
            </div>
            <p className="mt-3 max-w-[280px] text-[12px] leading-relaxed text-white/55">
              An open-source chamber workspace. Every client matter is handled
              with confidentiality, documented advice, and predictable fees.
            </p>
            <p className="mt-3 text-[11px] uppercase tracking-[0.1em] text-white/40">
              Demo deployment — content is editable placeholder data.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/45">
              Our Location
            </p>
            <address className="mt-2 space-y-1.5 text-[12px] not-italic leading-relaxed text-white/60">
              <span className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-[#B45309]" />
                {landing.address}
              </span>
              <span className="flex items-center gap-2">
                <Phone className="size-3.5 shrink-0 text-[#B45309]" />
                {landing.phone}
              </span>
              <span className="flex items-center gap-2">
                <Mail className="size-3.5 shrink-0 text-[#B45309]" />
                {landing.email}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="size-3.5 shrink-0 text-[#B45309]" />
                {landing.chamberHours}
              </span>
            </address>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/45">
              Map Preview
            </p>
            <div className="mt-2 flex h-[104px] flex-col items-center justify-center rounded-[10px] border border-white/12 bg-white/[0.04] text-center">
              <MapPin className="size-5 text-[#B45309]" strokeWidth={1.6} />
              <p className="mt-1.5 text-[11px] font-medium text-white/60">
                Map placeholder
              </p>
              <p className="mt-0.5 max-w-[180px] text-[10px] leading-snug text-white/35">
                A real map provider is not configured for this demo.
              </p>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/45">
              Quick Links
            </p>
            <ul className="mt-2 space-y-1.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[12px] text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1 text-[12px] font-medium text-[#D99A3E] transition-colors hover:text-[#E8AC54]"
                >
                  Admin Portal
                  <ArrowUpRight className="size-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-4 text-[11px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {CHAMBER.chamberName}. All rights reserved.</p>
          <p>
            Built with LawyerOS — open-source chamber management. No real client
            data in this demo.
          </p>
        </div>
      </div>
    </footer>
  );
}
