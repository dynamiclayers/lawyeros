"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  return (
    <div className="flex min-h-dvh bg-background">
      <DashboardSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setCollapsed((value) => !value)}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 max-w-full flex-1 flex-col overflow-x-hidden">
        <DashboardHeader onOpenMobileNav={() => setMobileOpen(true)} />
        <main id="main-content" className="min-w-0 flex-1 px-4 py-5 sm:px-5 lg:px-7 lg:py-6">
          {children}
        </main>
        <footer className="border-t border-border px-4 py-3 text-[11px] text-muted-foreground sm:px-5 lg:px-7">
          LawyerOS workspace · demo data only · changes are saved in this browser
        </footer>
      </div>
    </div>
  );
}
