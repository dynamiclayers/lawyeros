# LawyerOS

An open-source personal lawyer & chamber management system. It pairs a public
chamber website with a private legal workspace, sharing one restrained legal
design system: deep navy, warm off-white surfaces, and muted gold accents.

## What's included

**Public site (`/`)**

- Sticky dark navbar with smooth-scroll section links, theme controls, and booking CTA
- Two-column hero with credential label, serif headline, dual CTAs, and trust metrics
- Six practice-area cards (3 / 2 / 1 column responsive grid)
- About & credentials section with chamber photograph and four credential facts
- Four-step consultation booking wizard: mode → date & time → details → confirmation
  - An accessible calendar picker with keyboard support
  - Inline validation, loading/success/failure states, and a review summary
  - Generated booking reference plus a status-lookup dialog
- Testimonials (marked as demo data), FAQ accordion, and a full footer with a clearly
  labelled map placeholder

**Workspace (`/dashboard`)**

- Collapsible dark sidebar (drawer on mobile) and a header with global search
  (`Ctrl + K`), court reminder, theme controls, and a profile menu
- Overview: four KPI cards, today's cause list with stage updates, recent booking
  requests (approve / reschedule / cancel with confirmations), upcoming
  appointments, and quick actions
- Appointments: status tabs with live counts, search and date/mode filters,
  responsive table, and a detail drawer with contact, summary, and action history
- Cases & court diary: filterable/sortable table, and a case drawer with hearing
  timeline, private vs. client-visible notes, and linked documents
- Clients: searchable directory with masked contact data, linked cases, paid and
  due balances, and a full detail panel
- Documents: drag-and-drop upload with real progress, file-type and size limits,
  categories, visibility states, and empty/permission states
- Billing: collected / outstanding / monthly summary cards and a payment ledger
  with a confirm-before-save "Record Payment" modal
- Settings: four brand presets with a live preview, visitor default mode, and the
  public landing content (bio, credentials, fees, hours, booking days/slots, contact)

## Design system

- **Next.js App Router + TypeScript + Tailwind CSS v4**
- **next-themes** for light / dark / system, persisted across reloads
- Four brand presets applied via `data-theme-preset` on `<html>`:
  Classic Legal, Corporate Emerald, Supreme Burgundy, Modern Minimal
- All theme-aware color comes from semantic CSS variables — no color literals in
  components and no gradients anywhere
- Playfair Display (self-hosted) for editorial headings, Plus Jakarta Sans for UI
- Radix primitives (dialog, dropdown, tabs, accordion, sheet) styled as shadcn-style
  components; Lucide icons throughout
- Visible focus rings, 44px touch targets, `prefers-reduced-motion` support,
  labelled inputs, focus-trapping dialogs, and `aria-pressed` / `aria-current`
  states on toggles and navigation

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
```

## Data

This is a demo deployment. Seed bookings, cases, clients, documents, and payments
live in `src/lib/demo-data.ts` and are clearly labelled as sample content. Changes
made in the UI (booking requests, approvals, notes, uploads, payments, settings)
persist in the browser via the workspace provider so the public site and workspace
stay in sync. No real client data is included, contact details are masked in the
directory, and the map is an explicit placeholder until a provider is configured.

## Structure

```
src/
├── app/
│   ├── (public)/page.tsx        # landing page
│   ├── (dashboard)/dashboard/   # overview + six manager screens
│   ├── globals.css              # design tokens & preset definitions
│   └── layout.tsx               # font + theme + workspace providers
├── components/
│   ├── public/                  # header, hero, practice areas, booking, FAQ, footer
│   ├── dashboard/               # shell, sidebar, header, panels, drawers
│   ├── theme/                   # provider, mode toggle, preset switcher
│   └── ui/                      # buttons, cards, dialog, sheet, table, fields…
├── lib/                         # theme presets, demo data, formatting helpers
└── types/                       # domain types
```
