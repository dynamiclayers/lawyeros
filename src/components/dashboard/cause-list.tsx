"use client";

import { ArrowUpRight, Gavel } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TBody, TD, TH, THead, TR, TableShell } from "@/components/ui/table";
import { UpdateStageDialog } from "@/components/dashboard/update-stage-dialog";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { TODAY_CAUSE_LIST } from "@/lib/demo-data";
import { StatusDot } from "@/components/ui/badge";
import type { CauseItem } from "@/types";

export function CauseList() {
  const { cases } = useWorkspace();
  const [items, setItems] = useState<CauseItem[]>(TODAY_CAUSE_LIST);
  const [active, setActive] = useState<CauseItem | null>(null);

  return (
    <section className="rounded-[12px] border border-border bg-card">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <h2 className="text-[13.5px] font-semibold text-foreground">
          Today&apos;s Cause List
        </h2>
        <Link
          href="/dashboard/cases"
          className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:underline"
        >
          View All
          <ArrowUpRight className="size-3" />
        </Link>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
          <Gavel className="size-5 text-muted-foreground" />
          <p className="mt-2 text-[12.5px] font-medium text-foreground">
            No hearings listed for today
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Add a case hearing to see it in the cause list.
          </p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-border md:hidden">
            {items.map((item) => (
              <li key={item.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-mono text-[10.5px] text-muted-foreground">
                      {item.caseNo} · {item.court}
                    </p>
                    <p className="mt-0.5 text-[12.5px] font-medium text-foreground">
                      {item.client}
                    </p>
                  </div>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => setActive(item)}
                    className="shrink-0 border-border text-[11px]"
                  >
                    Update
                  </Button>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-[11.5px] text-foreground">
                  <StatusDot tone={item.purpose === "Final Hearing" ? "success" : "warning"} />
                  {item.purpose}
                  <span className="text-[10.5px] text-muted-foreground">· {item.time}</span>
                </p>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <TableShell>
              <THead>
                <TH>Case No.</TH>
                <TH>Court Name</TH>
                <TH>Client Name</TH>
                <TH>Stage/Purpose</TH>
                <TH className="text-right">Action</TH>
              </THead>
              <TBody>
                {items.map((item) => (
                  <TR key={item.id}>
                    <TD className="font-mono text-[11.5px] font-medium text-foreground">
                      {item.caseNo}
                    </TD>
                    <TD className="text-[12px] text-foreground">{item.court}</TD>
                    <TD className="text-[12px] text-foreground">{item.client}</TD>
                    <TD>
                      <span className="inline-flex items-center gap-1.5 text-[12px] text-foreground">
                        <StatusDot tone={item.purpose === "Final Hearing" ? "success" : "warning"} />
                        {item.purpose}
                      </span>
                      <span className="ml-1.5 text-[10.5px] text-muted-foreground">
                        {item.time}
                      </span>
                    </TD>
                    <TD className="text-right">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => setActive(item)}
                        className="border-border text-[11px]"
                      >
                        Update
                      </Button>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </TableShell>
          </div>
        </>
      )}

      <UpdateStageDialog
        item={active}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
        onUpdate={(purpose) => {
          if (!active) return;
          setItems((current) =>
            current.map((entry) =>
              entry.id === active.id ? { ...entry, purpose } : entry,
            ),
          );
          const linkedCase = cases.find((entry) => entry.caseNo === active.caseNo);
          toast.success(
            `${active.caseNo} updated${linkedCase ? ` · ${linkedCase.title}` : ""}`,
          );
        }}
      />
    </section>
  );
}
