"use client";

import { CircleAlert, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 py-16 text-center">
      <span className="flex size-11 items-center justify-center rounded-full border border-destructive/25 bg-destructive/8 text-destructive">
        <CircleAlert className="size-5" />
      </span>
      <h1 className="font-editorial mt-4 text-[26px] font-medium text-foreground">
        Something interrupted the chamber
      </h1>
      <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
        The workspace could not finish loading this section. Your saved data is
        unchanged — retry to continue.
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-[10.5px] text-muted-foreground">
          Reference: {error.digest}
        </p>
      ) : null}
      <Button size="sm" className="mt-5" onClick={reset}>
        <RefreshCw className="size-3.5" />
        Try again
      </Button>
    </main>
  );
}
