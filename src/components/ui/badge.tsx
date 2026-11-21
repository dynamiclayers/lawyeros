import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold leading-4",
  {
    variants: {
      variant: {
        default: "border-border bg-muted text-foreground",
        success: "border-success/25 bg-success/10 text-success",
        warning: "border-warning/30 bg-warning/10 text-warning",
        destructive: "border-destructive/25 bg-destructive/10 text-destructive",
        outline: "border-border bg-transparent text-muted-foreground",
        accent: "border-accent/25 bg-accent/10 text-accent",
        primary: "border-primary/15 bg-primary/5 text-primary dark:border-primary/25 dark:bg-primary/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}

export function StatusDot({ tone }: { tone: "success" | "warning" | "destructive" | "muted" }) {
  const colors: Record<string, string> = {
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
    muted: "bg-muted-foreground",
  };
  return <span aria-hidden className={cn("size-1.5 rounded-full", colors[tone])} />;
}

export { Badge, badgeVariants };
