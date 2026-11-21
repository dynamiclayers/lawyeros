"use client";

import {
  AlarmClock,
  BriefcaseBusiness,
  CalendarCheck,
  CheckCircle2,
  Wallet,
} from "lucide-react";
import { BookingRequests } from "@/components/dashboard/booking-requests";
import { CauseList } from "@/components/dashboard/cause-list";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeading } from "@/components/dashboard/page-heading";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { TODAY_CAUSE_LIST } from "@/lib/demo-data";
import { formatBDT } from "@/lib/utils";

export function DashboardOverview() {
  const { appointments, cases, payments } = useWorkspace();

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending",
  ).length;
  const activeCases = cases.filter(
    (legalCase) =>
      legalCase.status === "active" ||
      legalCase.status === "pending" ||
      legalCase.status === "adjourned",
  ).length;

  const now = new Date();
  const monthlyCollected = payments
    .filter((payment) => {
      const paid = new Date(`${payment.date}T00:00:00`);
      return (
        payment.status === "paid" &&
        paid.getMonth() === now.getMonth() &&
        paid.getFullYear() === now.getFullYear()
      );
    })
    .reduce((total, payment) => total + payment.amount, 0);

  const fallbackMonthly = 125000;

  return (
    <div className="space-y-4">
      <PageHeading
        title="Dashboard Overview"
        description="Here's what's happening at your chamber today."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Today's Hearings"
          value={String(TODAY_CAUSE_LIST.length).padStart(2, "0")}
          icon={CalendarCheck}
          trend={{ value: "+1", positive: true }}
          sub={`${TODAY_CAUSE_LIST.length} listed`}
          tone="accent"
        />
        <KpiCard
          label="Pending Appointments"
          value={String(pendingAppointments).padStart(2, "0")}
          icon={AlarmClock}
          trend={{ value: `+${pendingAppointments}`, positive: true }}
          tone="accent"
        />
        <KpiCard
          label="Active Cases"
          value={String(activeCases).padStart(2, "0")}
          icon={BriefcaseBusiness}
          sub={`${cases.length} in total`}
          tone="primary"
        />
        <KpiCard
          label="Monthly Fee Collected"
          value={formatBDT(monthlyCollected || fallbackMonthly)}
          icon={Wallet}
          trend={{ value: "+12%", positive: true }}
          sub="vs last month"
          tone="accent"
        />
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.32fr)_minmax(0,1fr)] [&>*]:min-w-0">
        <CauseList />
        <BookingRequests />
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.32fr)_minmax(0,1fr)] [&>*]:min-w-0">
        <UpcomingAppointments />
        <QuickActions />
      </div>

      <div className="flex items-start gap-2 rounded-[10px] border border-border bg-card px-3.5 py-2.5 text-[11px] text-muted-foreground">
        <CheckCircle2 className="mt-px size-3.5 shrink-0 text-success" />
        Demo workspace — figures and client names are sample data. Booking
        requests submitted on the public site appear here immediately.
      </div>
    </div>
  );
}
