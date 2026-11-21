import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/toaster";
import { WorkspaceProvider } from "@/components/providers/workspace-provider";
import { AppThemeProvider, THEME_INIT_SCRIPT } from "@/components/theme/theme-provider";
import "./globals.css";

const playfair = localFont({
  src: "../../public/fonts/playfair-display-latin.woff2",
  variable: "--font-playfair",
  display: "swap",
  weight: "400 700",
});

const jakarta = localFont({
  src: "../../public/fonts/plus-jakarta-sans-latin.woff2",
  variable: "--font-jakarta",
  display: "swap",
  weight: "400 700",
});

export const metadata: Metadata = {
  title: {
    default: "LawyerOS — Rahman Law Chamber",
    template: "%s · LawyerOS",
  },
  description:
    "LawyerOS is an open-source personal lawyer and chamber management system: a public chamber site and a private legal workspace.",
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23B45309' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3v18'/%3E%3Cpath d='M5 7h14'/%3E%3Cpath d='M7 7l-3 5h6L7 7'/%3E%3Cpath d='M17 7l-3 5h6l-3-5'/%3E%3Cpath d='M8 20h8'/%3E%3C/svg%3E",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme-preset="classic" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={`${jakarta.variable} ${playfair.variable} min-h-dvh antialiased`}>
        <AppThemeProvider>
          <WorkspaceProvider>
            <a
              href="#main-content"
              className="sr-only rounded-md bg-card px-4 py-2 text-sm font-semibold text-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-border"
            >
              Skip to content
            </a>
            {children}
            <Toaster />
          </WorkspaceProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
