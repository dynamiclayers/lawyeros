import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 py-16 text-center">
      <BrandMark />
      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
        404 — Page not found
      </p>
      <h1 className="font-editorial mt-2 max-w-md text-[30px] font-medium text-foreground">
        This part of the chamber isn&apos;t on the books
      </h1>
      <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
        The page you were looking for may have moved. Return to the public site
        or open the workspace.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Public site
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-4 text-[13px] font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Open workspace
        </Link>
      </div>
    </main>
  );
}
