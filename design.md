# LawyerOS --- UI Design Specification

> **Purpose:** Build a polished, trustworthy, responsive UI for an
> open-source Personal Lawyer & Chamber Management System.
>
> **Primary reference:** The supplied 1536 × 1024 visual. It presents
> the public law-chamber landing page on the left and the lawyer admin
> dashboard on the right. Use it as the visual direction, not as a
> pixel-perfect screenshot to copy.
>
> **Design principle:** Calm authority, clarity, and credibility. Avoid
> generic AI-generated SaaS aesthetics.

------------------------------------------------------------------------

## 1. Product and experience goals

Create two cohesive experiences that share one design system:

1.  **Public website** --- helps prospective clients understand the
    lawyer's services, trust their credentials, and request a
    consultation.
2.  **Private admin workspace** --- helps the lawyer manage hearings,
    appointments, cases, clients, documents, and payments efficiently.

The UI must feel: - Professional, established, and reassuring. -
Editorial rather than flashy. - Information-dense only where the task
requires it. - Consistent across public and private areas. - Accessible,
keyboard-friendly, and responsive.

### Avoid

-   Gradients of any kind, including gradient backgrounds, gradient
    borders, and gradient text.
-   Glassmorphism everywhere, excessive blur, glowing edges, neon
    colors, and oversized rounded cards.
-   Random decorative blobs, abstract 3D shapes, floating pills without
    purpose, and unnecessary illustrations.
-   Generic AI-dashboard patterns, excessive whitespace that wastes
    screen area, and inconsistent spacing.
-   Emoji as interface icons. Use a consistent Lucide icon set.
-   Fake functionality. Controls should either work or be clearly
    represented as static design examples.

------------------------------------------------------------------------

## 2. Visual direction

### Brand character

A contemporary legal chamber with a traditional foundation. Use deep
navy as the anchor, warm muted gold as the accent, warm off-white
surfaces, and restrained neutral borders.

### Core palette --- Classic Legal (default)

  Token                  Light value Usage
  -------------------- ------------- -----------------------------------------
  Background               `#F7F7F5` Main page background
  Foreground               `#172235` Main text
  Card                     `#FFFFFF` Cards, panels, forms
  Primary                  `#0F172A` Navy actions, navigation, headings
  Primary foreground       `#FFFFFF` Text on primary
  Accent                   `#B45309` Gold actions, highlights, small accents
  Accent foreground        `#FFFFFF` Text on gold
  Muted                    `#F0F1F2` Secondary surfaces
  Muted foreground         `#667085` Secondary text
  Border                   `#E4E7EC` Dividers and outlines
  Success                  `#16845B` Confirmed, paid, completed
  Warning                  `#B7791F` Pending, attention
  Destructive              `#C2413A` Cancelled, overdue, destructive actions

Use gold sparingly. Primary buttons may be gold on the public site;
admin primary actions should usually be navy, with gold reserved for
emphasis.

### Additional brand presets

All presets must map to semantic CSS variables. Do not hardcode preset
colors into individual components.

  Preset              Primary     Accent
  ------------------- ----------- -----------
  Classic Legal       `#0F172A`   `#B45309`
  Corporate Emerald   `#064E3B`   `#D97706`
  Supreme Burgundy    `#7F1D1D`   `#CA8A04`
  Modern Minimal      `#18181B`   `#2563EB`

Each preset must have suitable light and dark semantic values. Preserve
contrast and readability in every combination.

### Typography

-   **Display / editorial headings:** Playfair Display, with a suitable
    serif fallback.
-   **UI / body / forms / tables:** Plus Jakarta Sans or Inter.
-   Use serif only for the lawyer's name, major public hero heading, and
    selected editorial section headings.
-   Dashboard labels, data, forms, navigation, buttons, and tables use
    sans-serif.
-   Avoid too many font weights. Prefer 400, 500, 600, and 700.

Suggested scale: - Public hero: 48--60px desktop, 36--42px mobile. -
Page title: 28--34px. - Section title: 24--30px. - Card title:
15--17px. - Body: 14--16px. - Metadata / table helper text: 12--13px.

### Shape, borders, and elevation

-   Cards: 10--14px radius.
-   Inputs and buttons: 8--10px radius.
-   Pills: fully rounded only for compact status or reminder labels.
-   Borders: 1px solid semantic border.
-   Shadows: subtle, soft, and used only to establish hierarchy. Prefer
    borders over shadows.
-   Avoid thick outlines and heavy drop shadows.

### Spacing system

Use a consistent 4px base scale. Common values: 4, 8, 12, 16, 20, 24,
32, 40, 48, 64, 80. - Desktop content max width: 1440px. - Public page
horizontal padding: 40--64px desktop; 20--24px tablet; 16px mobile. -
Dashboard content padding: 28--32px desktop; 20px tablet; 16px mobile. -
Section spacing: 56--72px desktop; 40--48px mobile. - Keep card internal
padding consistent, usually 18--24px. - Align section headings, cards,
and content edges to a clear grid.

------------------------------------------------------------------------

## 3. Theme system requirements

Implement runtime theme switching without page reload using
`next-themes` plus a brand-preset attribute.

### Mode controls

-   Light
-   Dark
-   System

### Brand preset controls

-   Classic Legal
-   Corporate Emerald
-   Supreme Burgundy
-   Modern Minimal

### Behavior

-   The mode switcher and preset selector must be accessible from the
    public header and dashboard header.
-   Add a full theme settings panel in `/dashboard/settings`.
-   Persist the selected mode and preset.
-   Apply semantic variables at the root using a data attribute such as
    `data-theme-preset`.
-   Do not use direct color literals inside reusable UI components.
-   Ensure dropdowns, dialogs, calendars, charts, status badges, tables,
    and hover states all respect the active theme.
-   System mode should follow the operating system preference.
-   Theme changes must not cause layout shifts.

Suggested semantic tokens: `--background`, `--foreground`, `--card`,
`--card-foreground`, `--popover`, `--popover-foreground`, `--primary`,
`--primary-foreground`, `--secondary`, `--secondary-foreground`,
`--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`,
`--destructive`, `--border`, `--input`, `--ring`.

------------------------------------------------------------------------

## 4. Public landing page

Route group: `/(public)`

### 4.1 Header / navigation

Use a compact, dark navy horizontal navbar, matching the reference: -
Left: gold scales-of-justice mark and "LawyerOS". - Center:
About, Practice Areas, Credentials, Testimonials, FAQ. - Right: mode
toggle, preset selector, and gold "Book Consultation" CTA. - Sticky on
scroll, with a subtle solid surface and thin bottom border. - Mobile:
logo + menu trigger; put theme controls and booking CTA inside the
mobile menu or a compact action area. - Smooth-scroll to page sections.
Respect reduced-motion preferences.

### 4.2 Hero

Use a balanced two-column layout: - Left column: small "Bar Council
Enrolled" credential label; large serif headline "Expert Legal Support
You Can Trust"; concise value proposition; two CTAs: - Primary:
"Schedule a Consultation" - Secondary: "Track Booking Status" - Below
CTAs: three trust metrics with simple line icons: - 10+ Years
Experience - 500+ Cases Resolved - 98% Client Satisfaction - Right
column: professional lawyer portrait in a rectangular frame with modest
radius. Keep image proportions natural; do not over-decorate it. -
Background: warm neutral, optionally with a subtle real office/library
photograph. No gradient overlays. - At mobile sizes, stack text before
portrait and keep the CTA buttons easy to tap.

### 4.3 Practice areas

Six equal cards in a three-column desktop grid, two columns on tablet,
and one column on narrow mobile: 1. Civil Litigation 2. Criminal Defense
3. Corporate & Contract 4. Family Law 5. Property & Land 6. Cyber & Tech
Law

Each card contains: - Lucide icon in a restrained navy or gold
treatment. - Clear title. - One short description. - Optional small
arrow affordance. - Border changes to the active `--primary` on
hover/focus. - Avoid oversized illustrations and excessive card height.

### 4.4 About and credentials

Two-column composition: - Left: professional image of a courthouse or
chamber exterior. - Right: "About Our Chamber" heading, short bio, and
four credential facts: - Education: LL.B., LL.M. - Bar Council: Enrolled
Member - Court Jurisdiction: District Judge Court, High Court - Chamber
Hours: Mon--Fri, 9AM--6PM - Use small icons and thin dividers. Keep the
content readable and factual. - On mobile, image stacks above text.

### 4.5 Consultation booking

This is a high-priority conversion area. Give it a clear, contained
panel with a warm neutral surface and a white form surface. Do not
compress fields or force all steps into tiny columns.

Suggested desktop layout: - Intro column: "Book a Consultation" and a
concise explanation. - Form column: four-step progress indicator: 1.
Consultation Mode 2. Date & Time 3. Your Details 4. Confirmation

Booking flow: 1. **Mode:** In-Chamber Visit or Online Video
Consultation. Show the fee beside each option. Example fees: ৳2,000 and
৳1,000. 2. **Date & time:** Calendar with available dates and a clear
list/grid of available time slots. 3. **Your details:** Full name,
phone, email, brief case summary. 4. **Confirmation:** Clear success
state with a generated booking reference ID and next-step guidance.

Requirements: - Show selected mode, fee, date, and time in a review
summary. - Validate required fields and show inline errors. - Provide
loading, success, and failure states. - Do not imply a booking is
confirmed until the application confirms it. - Provide a "Track Booking
Status" action that opens a dialog/drawer where a client can enter the
booking reference ID. - On small screens, show one step at a time with a
full-width action button. - Use labels above fields, not
placeholder-only labels.

### 4.6 Testimonials

Three concise testimonial cards on desktop, stacked or horizontally
scrollable on mobile: - Quote - Client name - "Client" role label -
Optional avatar - Restrained star rating treatment Do not use fabricated
real-person claims in a production deployment; mark sample content as
demo data.

### 4.7 FAQ

Use an accessible accordion with concise questions: - How do I book an
appointment? - What are your consultation fees? - Which courts do you
practice in? - Can I reschedule my appointment? - What documents should
I bring? Keep answers short and useful.

### 4.8 Footer

Dark navy footer with clear columns: - Brand mark, chamber name, and
short trust statement. - Address and contact details. - Map preview or
map placeholder. - Quick links. - Admin Portal link. - Social links
where configured. - Copyright row. Do not invent a real address, phone
number, or social profile. Use clearly editable demo placeholders until
configured.

------------------------------------------------------------------------

## 5. Admin dashboard

Route group: `/(dashboard)`

### 5.1 Workspace shell

Match the reference's restrained dark-sidebar / light-content layout.

**Sidebar** - Dark navy background. - Brand mark and chamber name at
top. - Navigation with icon + label: - Dashboard - Appointments - Cases
& Court Diary - Clients - Documents - Billing & Fees - Settings - Active
route has a muted lighter navy surface and clear left/active
indicator. - Logout anchored near the bottom. - Collapsible on desktop;
becomes a drawer on mobile.

**Top header** - Global search with keyboard hint. - Today's court
reminder pill. - Theme mode control and preset selector. - Profile
avatar/menu. - On mobile, avoid crowding: show menu, page title or
search trigger, and profile.

### 5.2 Dashboard overview

Page heading: "Dashboard Overview" with a short contextual subheading.

**KPI row --- four cards** 1. Today's Hearings 2. Pending Appointments
3. Active Cases 4. Monthly Fee Collected

Each card: - Small icon and label. - Large numeric value. - Optional
comparison indicator only when real data exists. - Use consistent
heights and restrained borders. - Do not use four different bright
colors. Keep icons mostly navy/gold and reserve green for positive
trend.

**Main content grid** - Left: Today's Cause List / Court Diary. - Right:
Recent Booking Requests.

Cause list table columns: - Case No. - Court Name. - Client Name. -
Stage / Purpose. - Action ("Update").

Booking request rows: - Booking reference. - Consultation type. - Client
name or masked contact as appropriate. - Approve, Reschedule, Cancel
actions. - Use confirmation dialogs for destructive or consequential
actions.

**Lower dashboard panels** - Upcoming Appointments with date, time,
client, mode, and status. - Quick Actions: Add Appointment, New Case,
Upload Document, Record Payment. - Keep panels aligned and use
consistent card padding.

### 5.3 Appointments manager

Route: `/dashboard/appointments` - Page title and short description. -
Tabs: Pending, Confirmed, Completed, Cancelled. - Search and date
filters. - Responsive table with client, reference, mode, date/time,
fee, status, and actions. - Row click opens a right-side detail drawer
on desktop and a full-screen sheet on mobile. - Drawer includes client
contact, booking details, case summary, internal notes, and action
history. - Keep tab counts tied to data.

### 5.4 Cases and court diary

Route: `/dashboard/cases` - Filterable table: Case No., Case Title,
Court Name, Opposing Party, Next Hearing Date, Status. - Search, status
filter, court filter, and date sorting. - Case detail page/drawer: -
Summary header. - Hearing Timeline tab. - Private Case Notes tab. - Case
Documents tab. - Clearly distinguish private internal notes from
client-visible information. - Status badges should use semantic states,
not arbitrary colors.

### 5.5 Clients directory

Route: `/dashboard/clients` - Searchable directory. - Client name and
contact details. - Linked case count. - Total paid and due balance. -
Detail view with linked cases, appointments, and payment history. - Mask
sensitive data where appropriate and enforce authorization in the
application.

### 5.6 Document vault

Route: `/dashboard/documents` - Large but restrained drag-and-drop
upload zone. - File picker alternative must always be available. -
Categories: Petitions, Evidence, NID/ID, Court Orders. - Table columns:
file name, category, linked case, uploaded date, size, and actions. -
Include upload progress, success, failure, empty, and permission
states. - Show file type and size restrictions before upload. - Do not
expose private case documents publicly.

### 5.7 Billing and fee tracker

Route: `/dashboard/billing` - Summary cards for collected, outstanding,
and current-month fees. - Table of consultation fees, retainers,
payments, and due balances. - "Record Payment" opens a modal with
client, case, amount, payment date, method, and note. - Include
receipt/transaction reference and payment status. - Use clear currency
formatting for Bangladeshi Taka (৳). - Confirm before recording a
payment; show a success result only after persistence succeeds.

### 5.8 Appearance and landing page settings

Route: `/dashboard/settings` Use grouped settings sections rather than
one long undifferentiated form.

**Appearance** - Default public preset selector with four visual
swatches and labels. - Visitor default mode: Light, Dark, System. - Live
preview panel. - Save and reset actions.

**Landing page content** - Lawyer name and title. - Short biography. -
Profile photo upload and preview. - Education and Bar Council
credentials. - Court jurisdictions. - Consultation fees by mode. -
Chamber hours. - Available booking days and time slots. - Contact
details and chamber address. - Validate fields and show save state.

------------------------------------------------------------------------

## 6. Responsive behavior

### Breakpoints

Use Tailwind's standard breakpoints unless the project already defines a
consistent alternative.

-   **Large desktop:** Sidebar expanded; KPI cards in one row; main
    dashboard panels in two columns.
-   **Tablet:** Sidebar collapses to icon rail or drawer; KPI cards in
    two columns; tables scroll horizontally or use compact row cards.
-   **Mobile:** Sidebar becomes a sheet/drawer; KPI cards stack or use a
    two-column grid where space allows; forms become single-column;
    booking flow is step-based; tables become readable cards or
    controlled horizontal-scroll regions.

Never shrink desktop layouts proportionally until text becomes tiny.
Reflow content intentionally.

### Interaction and accessibility

-   Visible keyboard focus on every interactive control.
-   Proper heading hierarchy and semantic landmarks.
-   Labels associated with inputs.
-   Dialogs and drawers trap focus and close with Escape.
-   Accordions expose expanded state.
-   Color is never the only way to communicate status.
-   Respect `prefers-reduced-motion`.
-   Maintain WCAG AA contrast for text and controls.
-   Minimum touch target approximately 44 × 44px.
-   Provide loading, empty, error, success, disabled, and hover states.

------------------------------------------------------------------------

## 7. Component and implementation guidance

### Preferred stack

-   Next.js App Router
-   TypeScript
-   Tailwind CSS
-   shadcn/ui
-   `next-themes`
-   Lucide React
-   React Hook Form + Zod for form validation (if available in the
    project)
-   A calendar/date picker component with keyboard support

### Suggested project structure

``` text
src/
├── app/
│   ├── (public)/
│   │   └── page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── appointments/page.tsx
│   │   │   ├── cases/page.tsx
│   │   │   ├── clients/page.tsx
│   │   │   ├── documents/page.tsx
│   │   │   ├── billing/page.tsx
│   │   │   └── settings/page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── theme/
│   │   ├── theme-provider.tsx
│   │   ├── mode-toggle.tsx
│   │   └── preset-switcher.tsx
│   ├── public/
│   │   ├── public-header.tsx
│   │   ├── hero-section.tsx
│   │   ├── practice-area-grid.tsx
│   │   ├── about-section.tsx
│   │   ├── booking-wizard.tsx
│   │   ├── booking-status-dialog.tsx
│   │   ├── testimonials.tsx
│   │   ├── faq-accordion.tsx
│   │   └── public-footer.tsx
│   ├── dashboard/
│   │   ├── dashboard-shell.tsx
│   │   ├── dashboard-sidebar.tsx
│   │   ├── dashboard-header.tsx
│   │   ├── kpi-card.tsx
│   │   ├── cause-list.tsx
│   │   ├── booking-requests.tsx
│   │   ├── upcoming-appointments.tsx
│   │   └── quick-actions.tsx
│   └── ui/
├── lib/
│   ├── theme-presets.ts
│   ├── utils.ts
│   └── validators/
└── types/
```

### Component quality rules

-   Build reusable components around real patterns, not one-off visual
    wrappers.
-   Keep page composition separate from data access and business logic.
-   Use semantic CSS variables for every theme-aware color.
-   Use consistent variants for buttons, badges, cards, inputs, and
    tables.
-   Avoid giant components. Split by meaningful sections and
    interactions.
-   Use realistic but clearly identified demo data.
-   Do not hardcode confidential client or case information.
-   Do not use placeholder text as a substitute for labels.
-   Do not implement a fake map; use a clearly marked map placeholder
    until a real map provider is configured.

------------------------------------------------------------------------

## 8. Design tokens and CSS implementation notes

Define CSS variables in `globals.css` for: - Background / foreground. -
Card / card foreground. - Popover / popover foreground. - Primary /
primary foreground. - Secondary / secondary foreground. - Muted / muted
foreground. - Accent / accent foreground. - Destructive. - Border /
input / ring. - Sidebar background / foreground / active state. - Chart
colors only if charts are used.

Use preset attributes on the root element, for example: -
`data-theme-preset="classic"` - `data-theme-preset="emerald"` -
`data-theme-preset="burgundy"` - `data-theme-preset="minimal"`

Provide separate variable definitions for light and dark modes. The
components should consume semantic tokens through Tailwind utilities or
CSS variables; never branch on preset names inside individual UI
components.

------------------------------------------------------------------------

## 9. Suggested page content and sample data

Use the following only as editable demonstration content: - Chamber:
LawyerOS - Hero headline: Expert Legal Support You Can Trust -
Experience: 10+ Years - Cases resolved: 500+ - Client satisfaction:
98% - Consultation fees: In-Chamber ৳2,000; Online ৳1,000 - Chamber
hours: Mon--Fri, 9AM--6PM - Education: LL.B., LL.M. - Jurisdiction:
District Judge Court, High Court

The visual reference includes sample dashboard values such as 6
hearings, 12 pending appointments, 48 active cases, and ৳1,25,000
monthly fees. Treat these as mock data only, not real operational data.

------------------------------------------------------------------------

## 10. Acceptance checklist

### Visual

-   [ ] Strong navy / warm-white / muted-gold legal identity.
-   [ ] No gradients anywhere.
-   [ ] Typography uses a clear serif + sans-serif pairing.
-   [ ] Spacing and alignment follow a consistent scale.
-   [ ] Cards, forms, tables, and navigation feel like one system.
-   [ ] Public page and admin dashboard are visually related but
    optimized for different tasks.
-   [ ] Theme presets work in light and dark modes.

### Public site

-   [ ] Sticky responsive navigation.
-   [ ] Hero with clear CTAs and trust metrics.
-   [ ] Six practice area cards.
-   [ ] About and credentials section.
-   [ ] Multi-step consultation booking UI.
-   [ ] Booking confirmation and status lookup UI.
-   [ ] Testimonials, FAQ, and footer.

### Admin

-   [ ] Responsive collapsible sidebar and header.
-   [ ] Four KPI cards.
-   [ ] Today's cause list and booking requests.
-   [ ] Appointment, case, client, document, billing, and settings
    screens.
-   [ ] Clear empty, loading, error, and success states.

### Engineering

-   [ ] Next.js App Router and TypeScript.
-   [ ] shadcn/ui components where appropriate.
-   [ ] Semantic CSS variables for all theme-aware surfaces.
-   [ ] `next-themes` for mode switching.
-   [ ] Preset selection persists across navigation and reloads.
-   [ ] Accessible keyboard navigation and focus states.
-   [ ] No fabricated success states or nonfunctional action buttons.

------------------------------------------------------------------------

## Final instruction to the AI design / coding agent

Study the supplied reference image before implementation. Reproduce its
**design language and information hierarchy**, not its cramped areas or
any accidental spacing problems. Create the public landing page and
admin dashboard as two separate, complete responsive experiences.
Prioritize clean alignment, readable type, realistic content density,
generous but controlled spacing, and a restrained legal brand. **No
gradients, no AI slop, no decorative clutter.**
