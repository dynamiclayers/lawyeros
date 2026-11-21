"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      theme={(resolvedTheme as "light" | "dark" | undefined) ?? "system"}
      position="bottom-right"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "!rounded-[10px] !border !border-border !bg-card !text-foreground !shadow-float",
          title: "!text-[13px] !font-semibold",
          description: "!text-[12px] !text-muted-foreground",
          actionButton: "!bg-primary !text-primary-foreground",
          cancelButton: "!bg-muted !text-foreground",
          closeButton: "!border-border !bg-card !text-muted-foreground",
        },
      }}
    />
  );
}
