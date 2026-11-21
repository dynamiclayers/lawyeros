"use client";

import {
  Bell,
  CalendarDays,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { PresetSwitcher } from "@/components/theme/preset-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { CHAMBER, TODAY_CAUSE_LIST } from "@/lib/demo-data";
import { initials } from "@/lib/utils";

function useCourtReminder() {
  const [today] = useState(() => new Date());
  const count = TODAY_CAUSE_LIST.length;
  const label = today.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return { count, label };
}

export function DashboardHeader({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const router = useRouter();
  const { bookings, appointments, cases, clients, documents } = useWorkspace();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const reminder = useCourtReminder();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const isShortcut =
        (event.key === "k" || event.key === "K") &&
        (event.metaKey || event.ctrlKey);
      if (isShortcut) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(timer);
    }
    setQuery("");
  }, [searchOpen]);

  const needle = query.trim().toLowerCase();
  const results = needle
    ? [
        ...bookings
          .filter(
            (booking) =>
              booking.reference.toLowerCase().includes(needle) ||
              booking.clientName.toLowerCase().includes(needle),
          )
          .slice(0, 4)
          .map((booking) => ({
            id: booking.id,
            title: booking.reference,
            meta: `${booking.clientName} · Booking request`,
            href: "/dashboard/appointments",
          })),
        ...cases
          .filter(
            (legalCase) =>
              legalCase.caseNo.toLowerCase().includes(needle) ||
              legalCase.title.toLowerCase().includes(needle),
          )
          .slice(0, 4)
          .map((legalCase) => ({
            id: legalCase.id,
            title: legalCase.caseNo,
            meta: legalCase.title,
            href: "/dashboard/cases",
          })),
        ...clients
          .filter(
            (client) =>
              client.name.toLowerCase().includes(needle) ||
              client.email.toLowerCase().includes(needle),
          )
          .slice(0, 4)
          .map((client) => ({
            id: client.id,
            title: client.name,
            meta: client.email,
            href: "/dashboard/clients",
          })),
      ]
    : [];

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-card px-3 sm:px-5 lg:h-[60px] lg:px-7">
      <button
        type="button"
        onClick={onOpenMobileNav}
        className="flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="size-4" />
      </button>

      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        className="flex h-9 w-full max-w-[340px] items-center gap-2 rounded-lg border border-border bg-background px-2.5 text-left text-[12.5px] text-muted-foreground transition-colors hover:bg-muted"
        aria-label="Search workspace (Ctrl + K)"
      >
        <Search className="size-3.5 shrink-0" />
        <span className="truncate">Search anything…</span>
        <kbd className="ml-auto hidden shrink-0 rounded border border-border bg-card px-1 py-0.5 text-[10px] font-medium text-muted-foreground sm:block">
          Ctrl + K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <Link
          href="/dashboard/cases"
          className="hidden items-center gap-2 rounded-full border border-warning/30 bg-warning/8 px-2.5 py-1.5 text-[11.5px] font-medium text-warning transition-colors hover:bg-warning/12 md:inline-flex"
          title="Today's court reminder"
        >
          <CalendarDays className="size-3.5" />
          <span className="text-foreground/80">Today: {reminder.label}</span>
          <span className="rounded-full bg-warning/15 px-1.5 py-0.5 text-[10px] font-semibold">
            {reminder.count} hearings
          </span>
        </Link>

        <div className="hidden items-center gap-1.5 sm:flex">
          <div className="[&_button]:border-border [&_button]:bg-card">
            <ModeToggle compact />
          </div>
          <PresetSwitcher className="hidden md:inline-flex" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card p-1 pr-1.5 transition-colors hover:bg-muted"
            aria-label="Profile menu"
          >
            <span
              aria-hidden
              className="flex size-7 items-center justify-center rounded-md bg-primary text-[10.5px] font-semibold text-primary-foreground"
            >
              {initials(CHAMBER.lawyerName)}
            </span>
            <ChevronDown className="size-3 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
            <div className="px-2.5 pb-2">
              <p className="text-[12.5px] font-semibold text-foreground">
                {CHAMBER.lawyerName}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {CHAMBER.lawyerTitle}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="sm:hidden">Appearance</DropdownMenuLabel>
            <div className="px-2.5 pb-2 sm:hidden">
              <ModeToggle compact />
              <div className="mt-1.5">
                <PresetSwitcher />
              </div>
            </div>
            <DropdownMenuSeparator className="sm:hidden" />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="w-full">
                <Settings className="size-3.5" />
                Chamber settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/" className="w-full">
                <UserRound className="size-3.5" />
                View public site
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => router.push("/")}>
              <LogOut className="size-3.5" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Search workspace</DialogTitle>
            <DialogDescription>
              Demo search across bookings, cases, and clients stored in this
              browser.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-3">
            <Input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Client name, case number, or booking reference"
              aria-label="Search workspace"
            />
            <div className="min-h-[120px]">
              {!needle ? (
                <div className="rounded-[10px] border border-dashed border-border px-3 py-5 text-center">
                  <p className="text-[12px] text-muted-foreground">
                    Start typing to search. Try{" "}
                    <code className="font-mono text-[11px] text-foreground">
                      CR-1023
                    </code>{" "}
                    or{" "}
                    <code className="font-mono text-[11px] text-foreground">
                      Ahmed
                    </code>
                    .
                  </p>
                  <p className="mt-2 text-[10.5px] text-muted-foreground">
                    {bookings.length} bookings · {cases.length} cases ·{" "}
                    {clients.length} clients · {documents.length} documents
                  </p>
                </div>
              ) : results.length ? (
                <ul className="space-y-1">
                  {results.map((result) => (
                    <li key={`${result.href}-${result.id}`}>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchOpen(false);
                          router.push(result.href);
                        }}
                        className="flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-muted"
                      >
                        <span className="min-w-0">
                          <span className="block font-mono text-[11.5px] font-semibold text-foreground">
                            {result.title}
                          </span>
                          <span className="block truncate text-[11px] text-muted-foreground">
                            {result.meta}
                          </span>
                        </span>
                        <Badge variant="outline">Open</Badge>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-[10px] border border-border px-3 py-6 text-center">
                  <p className="text-[12px] font-medium text-foreground">
                    No matches
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Try a partial name or reference.
                  </p>
                </div>
              )}
            </div>
            <p className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
              <Bell className="size-3" />
              {appointments.length} appointments in the workspace
            </p>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </header>
  );
}
