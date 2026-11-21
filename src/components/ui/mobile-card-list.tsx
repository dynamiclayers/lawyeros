import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function MobileCardList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ul className={cn("divide-y divide-border md:hidden", className)}>{children}</ul>
  );
}

export function DesktopTableOnly({ children }: { children: ReactNode }) {
  return <div className="hidden md:block">{children}</div>;
}

export function MobileCard({
  onClick,
  children,
  header,
  trailing,
  openLabel = "Open details",
}: {
  onClick?: () => void;
  children: ReactNode;
  header: ReactNode;
  trailing?: ReactNode;
  openLabel?: string;
}) {
  return (
    <li>
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {onClick ? (
              <button
                type="button"
                onClick={onClick}
                aria-label={openLabel}
                className="block w-full text-left"
              >
                {header}
              </button>
            ) : (
              header
            )}
          </div>
          {trailing ? <span className="shrink-0">{trailing}</span> : null}
        </div>
        {children}
      </div>
    </li>
  );
}
