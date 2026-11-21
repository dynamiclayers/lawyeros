"use client";

import {
  CalendarDays,
  ChevronLeft,
  Gavel,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Wallet,
  FileText,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { cn } from "@/lib/utils";
import { CHAMBER } from "@/lib/demo-data";

export const DASHBOARD_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/dashboard/cases", label: "Cases & Court Diary", icon: Gavel },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/billing", label: "Billing & Fees", icon: Wallet },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Workspace" className="flex-1 overflow-y-auto px-2.5 py-3">
      <ul className="space-y-0.5">
        {DASHBOARD_NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-[12.5px] font-medium transition-colors",
                  active
                    ? "bg-sidebar-active text-sidebar-active-foreground"
                    : "text-sidebar-foreground hover:bg-white/[0.05] hover:text-white",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-accent",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
                <Icon
                  className={cn(
                    "size-[15px] shrink-0",
                    active ? "text-accent" : "text-sidebar-muted group-hover:text-white/80",
                  )}
                  strokeWidth={1.85}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SidebarBrand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 border-b border-sidebar-border px-4 py-3.5"
      aria-label="Back to public chamber site"
    >
      <BrandMark />
      <span className="leading-tight">
        <span className="block text-[13px] font-semibold text-white">LawyerOS</span>
        <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.1em] text-sidebar-muted">
          {CHAMBER.chamberShort}
        </span>
      </span>
    </Link>
  );
}

export function SidebarFooter({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="border-t border-sidebar-border px-2.5 py-3">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-[12.5px] font-medium text-sidebar-foreground transition-colors hover:bg-white/[0.05] hover:text-white"
      >
        <LogOut className="size-[15px] shrink-0 text-sidebar-muted" strokeWidth={1.85} />
        Logout
      </Link>
      <p className="mt-2 px-2.5 text-[10px] text-sidebar-muted/70">
        {CHAMBER.chamberName}
      </p>
    </div>
  );
}

export function DashboardSidebar({
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}) {
  return (
    <>
      <aside
        className={cn(
          "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 lg:flex",
          collapsed ? "w-[68px]" : "w-[228px]",
        )}
      >
        {collapsed ? (
          <Link
            href="/"
            className="flex items-center justify-center border-b border-sidebar-border py-3.5"
            aria-label="LawyerOS home"
          >
            <BrandMark />
          </Link>
        ) : (
          <SidebarBrand />
        )}

        {collapsed ? (
          <nav aria-label="Workspace" className="flex-1 px-2 py-3">
            <ul className="space-y-1">
              {DASHBOARD_NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <CollapsedLink href={item.href} label={item.label}>
                      <Icon className="size-[17px]" strokeWidth={1.85} />
                    </CollapsedLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : (
          <SidebarNav />
        )}

        {collapsed ? (
          <div className="border-t border-sidebar-border px-2 py-3">
            <Link
              href="/"
              aria-label="Logout"
              className="flex size-11 items-center justify-center rounded-lg text-sidebar-muted transition-colors hover:bg-white/[0.05] hover:text-white"
            >
              <LogOut className="size-[17px]" strokeWidth={1.85} />
            </Link>
          </div>
        ) : (
          <SidebarFooter />
        )}

        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-9 items-center justify-center gap-1.5 border-t border-sidebar-border text-[11px] font-medium text-sidebar-muted transition-colors hover:text-white"
        >
          <ChevronLeft
            className={cn("size-3.5 transition-transform", collapsed && "rotate-180")}
          />
          {collapsed ? null : "Collapse"}
        </button>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-primary/45 backdrop-blur-[2px] animate-enter-fade"
            onClick={onCloseMobile}
          />
          <div className="absolute inset-y-0 left-0 flex w-[264px] flex-col bg-sidebar shadow-float animate-drawer-in">
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close navigation"
              className="absolute right-2.5 top-3.5 flex size-8 items-center justify-center rounded-md text-sidebar-muted hover:text-white"
            >
              <X className="size-4" />
            </button>
            <SidebarBrand />
            <SidebarNav onNavigate={onCloseMobile} />
            <SidebarFooter onNavigate={onCloseMobile} />
          </div>
        </div>
      ) : null}
    </>
  );
}

function CollapsedLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = isActive(pathname, href);
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex size-11 items-center justify-center rounded-lg transition-colors",
        active
          ? "bg-sidebar-active text-accent"
          : "text-sidebar-muted hover:bg-white/[0.05] hover:text-white",
      )}
    >
      {active ? (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-accent"
        />
      ) : null}
      {children}
    </Link>
  );
}
