# Lumi Design System

## 0. Brand Summary

**Product name:** Lumi
**Vietnamese sales name:** Trợ Lý Lumi
**Product category:** AI operating workspace for SME teams and CEOs
**Core product wedge:** Daily Pulse → Operating Memory → CEO Morning Brief
**Primary URL for MVP:** `lumi.locuno.com`

Lumi helps SME teams update work clearly, while giving CEOs a calm, evidence-based operating brief every morning.

Lumi is not a generic AI chatbot.
Lumi is not a task app clone.
Lumi is not a surveillance tool.

Lumi is a calm operating assistant that helps a company see what is stuck, what is late, what is risky, and what needs a decision.

---

# 1. Design Philosophy

## 1.1 Core Positioning

> Calm clarity for running a company.

Lumi should feel like:

* A trusted operating assistant
* A civic-quality digital service
* A serious editorial product
* A calm command surface for important work
* A system that respects evidence, accountability, and human judgment

Lumi should not feel like:

* A flashy AI startup
* A productivity toy
* A surveillance dashboard
* A crypto-style interface
* A cyberpunk AI product
* A childish task manager
* A generic SaaS template

## 1.2 Visual Direction

The chosen visual language is:

> **Civic Editorial Minimalism**

But adjusted for a modern AI workspace:

> **Civic Editorial Intelligence**

This means:

* Institutional trust
* Editorial clarity
* Warm human texture
* Precise operating structure
* No AI gimmicks
* No decorative noise
* High signal, low spectacle

The product should look serious enough for a CEO, friendly enough for a team member, and refined enough to be respected by a top designer.

---

# 2. Logo Interpretation

The Lumi logo is built from:

* A geometric **L-form**
* A four-point star / clarity mark
* Deep institutional blue
* Strong negative space
* A structured but slightly human silhouette

## 2.1 What the logo communicates

The logo should be interpreted as:

* **L-form:** structure, framework, operating system
* **Four-point star:** clarity, guidance, verification, signal
* **Blue:** trust, reliability, calm intelligence
* **Open space:** simplicity, room to think
* **Sharp geometry:** precision, not decoration

## 2.2 Logo usage principles

Use the logo with restraint.

Do:

* Use generous whitespace around the mark
* Use the mark on warm paper or white backgrounds
* Use the star as a subtle system motif
* Use the L geometry as inspiration for layouts, corners, dividers, and section framing

Do not:

* Add gradients to the logo
* Add AI glow
* Add glassmorphism
* Add drop shadows
* Add animated sparkle effects
* Place the logo on noisy backgrounds
* Overuse the star until it feels childish or magical

## 2.3 Logo clear space

Minimum clear space around the logo should equal the width of the star shape inside the logo.

For small app icons, use the mark alone.

For product headers, use:

```text
[Logo mark] Lumi
```

For Vietnamese sales material, use:

```text
[Logo mark] Trợ Lý Lumi
```

---

# 3. Brand Keywords

Use these words as design filters:

* Clear
* Calm
* Reliable
* Precise
* Evidenced
* Human
* Operational
* Executive
* Trustworthy
* Warm
* Focused
* Quietly intelligent

Avoid these words as visual directions:

* Futuristic
* Magical
* Viral
* Flashy
* Neon
* Robotic
* Cyber
* Gamified
* Trendy
* Hype

---

# 4. Core Design Principle

## 4.1 The Mass-Love Layer

Most users should instantly feel:

> “This is clear, useful, and trustworthy.”

That means:

* Readable type
* Obvious hierarchy
* Familiar layouts
* No visual stress
* No overdesigned interactions
* No hidden navigation
* No cleverness that blocks understanding

## 4.2 The Designer-Praise Layer

Top designers should notice:

> “This is restrained, consistent, and unusually well-edited.”

That means:

* Strong typographic rhythm
* Beautiful whitespace
* Intentional grids
* Subtle paper texture
* Icon system derived from the logo
* No generic SaaS gradients
* No AI stock illustration
* No template feeling

## 4.3 The CEO Layer

CEOs should feel:

> “This helps me see what matters without micromanaging.”

That means:

* Prioritize brief, risk, decision, and operating signal
* Avoid task-board clutter on CEO pages
* Use ranking, grouping, and evidence
* Make every section answer: “What should I know or decide?”

---

# 5. Color System

## 5.1 Primary Palette

### Lumi Blue

```css
--color-lumi-blue: #0E3EB8;
```

Use for:

* Logo
* Primary buttons
* Key links
* Active navigation
* Selected states
* Important chart lines
* Executive brief highlights

Personality:

* Trust
* Governance
* Reliability
* Operating clarity

---

### Civic Navy

```css
--color-civic-navy: #102A43;
```

Use for:

* Headlines
* Body text
* Navigation labels
* Dense UI text
* Executive brief titles

Personality:

* Serious
* Editorial
* Stable
* Professional

---

### Paper White

```css
--color-paper-white: #FAF8F4;
```

Use for:

* Main app background
* Landing page background
* Report surfaces
* Empty states

Do not default to pure white.
Warm paper makes the product feel more mature and less like a generic SaaS dashboard.

---

### Surface White

```css
--color-surface-white: #FFFFFF;
```

Use for:

* Cards
* Modals
* Tables
* Input backgrounds

---

### Archive Gray

```css
--color-archive-gray: #E7EAF0;
```

Use for:

* Borders
* Dividers
* Table lines
* Quiet UI structure
* Disabled states

---

### Soft Slate

```css
--color-soft-slate: #667085;
```

Use for:

* Secondary text
* Timestamps
* Helper text
* Metadata

---

### Signal Amber

```css
--color-signal-amber: #F4A62A;
```

Use only for:

* Warnings
* Overdue flags
* Important notices
* Cash/payment risks
* Items needing attention

Limit amber to 5% of the interface.

---

### Risk Red

```css
--color-risk-red: #C2410C;
```

Use sparingly for:

* Critical risk
* Failed states
* Dangerous actions
* Data errors

Do not use red for normal urgency. Use amber first.

---

### Success Green

```css
--color-success-green: #1F7A4D;
```

Use for:

* Completed work
* Resolved risks
* Confirmed decisions
* Positive status

Avoid bright SaaS green.

---

## 5.2 Extended Palette

```css
:root {
  --color-lumi-blue: #0E3EB8;
  --color-lumi-blue-hover: #0B3397;
  --color-lumi-blue-soft: #EAF0FF;

  --color-civic-navy: #102A43;
  --color-ink: #172033;
  --color-soft-slate: #667085;

  --color-paper-white: #FAF8F4;
  --color-surface-white: #FFFFFF;
  --color-archive-gray: #E7EAF0;
  --color-border: #D9DEE8;

  --color-signal-amber: #F4A62A;
  --color-amber-soft: #FFF4DC;

  --color-risk-red: #C2410C;
  --color-red-soft: #FFF1EC;

  --color-success-green: #1F7A4D;
  --color-green-soft: #E9F7EF;
}
```

---

# 6. Typography

## 6.1 Typeface Recommendation

Use:

* **Inter** for product UI and body text
* **IBM Plex Sans** as an optional editorial headline alternative
* **IBM Plex Serif** only for selective editorial marketing moments, not core app UI

Avoid:

* Poppins
* Montserrat
* Futura-like startup fonts
* Overly rounded friendly fonts
* Decorative serif fonts
* Thin weights below 400

## 6.2 Type Scale

```css
--font-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

--text-xs: 12px;
--text-sm: 14px;
--text-md: 16px;
--text-lg: 18px;
--text-xl: 22px;
--text-2xl: 28px;
--text-3xl: 36px;
--text-4xl: 48px;
--text-5xl: 64px;
```

## 6.3 Product UI Typography

### App page title

```css
font-size: 28px;
line-height: 1.2;
font-weight: 650;
letter-spacing: -0.02em;
```

### Section title

```css
font-size: 18px;
line-height: 1.35;
font-weight: 650;
```

### Body text

```css
font-size: 16px;
line-height: 1.6;
font-weight: 400;
```

### Metadata

```css
font-size: 13px;
line-height: 1.4;
font-weight: 450;
color: var(--color-soft-slate);
```

## 6.4 Marketing Typography

Marketing pages can be more editorial.

Hero headline:

```css
font-size: clamp(42px, 7vw, 88px);
line-height: 0.96;
font-weight: 700;
letter-spacing: -0.055em;
```

Hero body:

```css
font-size: clamp(18px, 2vw, 22px);
line-height: 1.55;
font-weight: 400;
```

Use large confident typography instead of hero illustrations.

---

# 7. Layout System

## 7.1 Grid

Desktop:

```css
max-width: 1200px;
outer-margin: 80px;
grid-columns: 12;
gap: 24px;
```

Tablet:

```css
outer-margin: 40px;
gap: 20px;
```

Mobile:

```css
outer-margin: 20px;
gap: 16px;
```

## 7.2 Spacing Scale

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

## 7.3 Whitespace Rule

Target composition:

```text
70% whitespace
30% content
```

This does not mean empty. It means edited.

Avoid:

* Dense dashboard syndrome
* Too many widgets
* Competing cards
* Small labels everywhere
* Multi-column clutter on executive pages

## 7.4 One Message Per Section

Every page section must answer one clear user question.

Examples:

* “What needs my decision?”
* “What is overdue?”
* “Where is the team blocked?”
* “Which customer is risky?”
* “What should I do today?”

If a section answers more than one question, split it.

---

# 8. Shape and Geometry

## 8.1 Border Radius

Use modest radius.

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
```

Default card radius:

```css
border-radius: 8px;
```

Default button radius:

```css
border-radius: 8px;
```

Avoid:

* giant pill buttons
* extreme roundness
* playful blobs
* organic shapes that conflict with the logo geometry

## 8.2 Borders

Use borders instead of heavy shadows.

```css
border: 1px solid var(--color-border);
```

Borders should feel archival, not boxy.

## 8.3 Shadows

Use very limited shadows.

Allowed:

```css
box-shadow: 0 1px 2px rgba(16, 42, 67, 0.05);
```

Avoid:

* glassmorphism shadows
* floating SaaS cards
* thick offset neo-brutalist shadows
* colored glows

---

# 9. Iconography

## 9.1 Icon Principle

Icons should feel like they belong to the logo.

Use:

* Simple line icons
* Geometric construction
* 1.75px or 2px stroke
* Square or angled details
* Occasional four-point star motif

Avoid:

* Cartoon icons
* 3D icons
* AI sparkle overload
* Gradient icons
* Emoji-like icons
* Random icon packs with inconsistent stroke

## 9.2 Core Icon Motifs

Derived from the logo:

### Star mark

Meaning:

* verified
* clarified
* important insight
* Lumi found this

Use sparingly.

### L-corner

Meaning:

* structure
* framework
* workspace
* task/project container

### Annotation dot

Meaning:

* evidence
* source
* comment
* detail

### Line bracket

Meaning:

* grouping
* section
* report category

## 9.3 Icon Examples

* Daily Pulse: circle + small star
* CEO Brief: document + star
* Commitment: check line + deadline dot
* Risk: amber marker + bracket
* Decision: forked path + star
* Project: L-frame + stacked cards
* Recurring: loop arrow + small dot
* Evidence: document + annotation dot
* Chat: speech bubble + L-corner

---

# 10. UI Components

## 10.1 Buttons

### Primary Button

Use for the single main action.

```css
background: var(--color-lumi-blue);
color: white;
border-radius: 8px;
height: 40px;
padding: 0 16px;
font-weight: 600;
```

Hover:

```css
background: var(--color-lumi-blue-hover);
```

Do not use gradients.

### Secondary Button

```css
background: transparent;
color: var(--color-civic-navy);
border: 1px solid var(--color-border);
border-radius: 8px;
```

### Tertiary Button

Text-only.

```css
color: var(--color-lumi-blue);
font-weight: 550;
```

### Destructive Button

Use rarely.

```css
background: transparent;
color: var(--color-risk-red);
border: 1px solid var(--color-risk-red);
```

---

## 10.2 Cards

Cards should feel like documents, not floating glass panels.

Default card:

```css
background: var(--color-surface-white);
border: 1px solid var(--color-border);
border-radius: 8px;
padding: 20px;
box-shadow: 0 1px 2px rgba(16, 42, 67, 0.04);
```

Use cards for:

* Brief items
* Task summaries
* Risk items
* Decision requests
* Project summaries
* Pulse summaries

Avoid:

* Nested cards inside cards
* Multiple shadow layers
* Decorative gradients
* Overly colorful cards

---

## 10.3 Inputs

Inputs should be calm and highly readable.

```css
height: 40px;
border: 1px solid var(--color-border);
border-radius: 8px;
background: white;
padding: 0 12px;
font-size: 15px;
```

Focus:

```css
border-color: var(--color-lumi-blue);
box-shadow: 0 0 0 3px rgba(14, 62, 184, 0.12);
```

Textarea for daily pulse:

```css
min-height: 140px;
line-height: 1.6;
```

---

## 10.4 Badges

Use badges for status and risk.

### Status badges

Open:

```css
background: #F2F4F7;
color: #344054;
```

In progress:

```css
background: var(--color-lumi-blue-soft);
color: var(--color-lumi-blue);
```

Done:

```css
background: var(--color-green-soft);
color: var(--color-success-green);
```

Overdue:

```css
background: var(--color-amber-soft);
color: #9A5B00;
```

Critical:

```css
background: var(--color-red-soft);
color: var(--color-risk-red);
```

Do not use bright red unless critical.

---

## 10.5 Tables

Tables should be functional, not spreadsheet-like.

Use for:

* Tasks
* Commitments
* Risks
* Decisions
* Projects

Rules:

* Row height minimum 52px
* Strong title column
* Subtle metadata
* Sticky header if table is long
* Use badges for status
* Avoid excessive grid lines

Table border:

```css
border-bottom: 1px solid var(--color-border);
```

Header:

```css
font-size: 12px;
font-weight: 650;
text-transform: uppercase;
letter-spacing: 0.06em;
color: var(--color-soft-slate);
```

---

# 11. Product Surfaces

## 11.1 CEO Brief Page

This is the most important product surface.

It should feel like:

* A morning briefing document
* A calm executive memo
* A prioritized decision surface
* Not a dashboard

Page structure:

```text
Header:
  Good morning / Brief date / Generate brief button

Executive Summary:
  2–4 sentence summary

Sections:
  1. Needs CEO Decision
  2. Customer / Revenue Risk
  3. Cash / Receivables
  4. Overdue Commitments
  5. Team Blockers
  6. Follow-up Opportunities
  7. Suggested Questions
```

Each brief item must show:

* Title
* Why it matters
* Suggested CEO action
* Owner
* Due date
* Source/evidence
* Confidence if low

### Brief item layout

```text
┌──────────────────────────────────────────────┐
│ Decision needed                              │
│ Approve 5% discount for ABC before 11:00     │
│                                              │
│ Why it matters: 120M VND deal may stall.     │
│ Suggested action: approve or hold price.     │
│                                              │
│ Owner: Lan · Source: Sales pulse · 08/06     │
└──────────────────────────────────────────────┘
```

Use the four-point star only for Lumi-generated insight, not every item.

---

## 11.2 Daily Pulse Page

This page must be extremely simple.

Goal:

> A team member should complete the form in 60–90 seconds.

Use one question per block.

Avoid:

* Many required fields
* Dense forms
* Project-management jargon
* Long instructions
* Too many dropdowns

Default questions:

```text
1. Hôm nay bạn hoàn thành việc gì quan trọng?
2. Bạn đang kẹt ở đâu?
3. Bạn đã hứa gì với khách / team / nhà cung cấp?
4. Việc nào cần CEO hoặc quản lý quyết?
5. Có rủi ro nào về khách, doanh thu, công nợ, đơn hàng hoặc deadline không?
6. Ngày mai việc quan trọng nhất của bạn là gì?
```

Visual style:

* Large textarea
* Minimal labels
* Warm paper background
* Clear submit button
* Small note: “Mất khoảng 60 giây.”

---

## 11.3 Tasks Page

Tasks are important, but they are not the brand hero.

Design goal:

> Make task work usable without letting the product become a task manager clone.

Task item must show:

* Title
* Owner
* Due date
* Priority
* Status
* Project
* Business impact if any

Add Lumi-specific fields:

* Customer name
* Money amount
* Business impact
* Source type
* Linked commitment/risk

---

## 11.4 Projects Page

Project UI should be clean and operational.

Project card should show:

* Project name
* Owner
* Team
* Status
* Due date
* Open tasks
* Overdue tasks
* Risks linked to project

Avoid complex Gantt/chart features in MVP.

---

## 11.5 Recurring Tasks Page

Recurring tasks should feel like operating routines.

Use language:

* Routine
* Cadence
* Every Monday
* Daily
* Monthly
* Next run

Avoid overly technical RRULE language in UI.

Example:

```text
Check receivables
Every Monday · Finance · Next run: 10/06
```

---

## 11.6 Commitments Page

This is a Lumi-specific page.

Commitments are stronger than tasks.

Commitment list should show:

* Promise
* Owner
* Stakeholder/customer
* Due date/time
* Business impact
* Risk level
* Evidence
* Status

Use strong editorial labels:

* “Who promised what?”
* “What is overdue?”
* “Which promises affect customers or money?”

---

## 11.7 Risks Page

Risks should be sober, not scary.

Risk card should show:

* Risk title
* Severity
* Likelihood
* Owner
* Related customer/project/task
* Money amount if available
* Evidence
* Suggested action

Do not use red-heavy UI. Use amber unless critical.

---

## 11.8 Decisions Page

Decision requests should feel like an executive queue.

Decision item should show:

* Decision needed
* Who requested it
* Needed by date
* Options
* Recommended option if available
* Business impact
* Evidence
* Decision status

The page should answer:

> What is waiting on leadership?

---

## 11.9 Chat with Lumi

Chat should not feel like ChatGPT clone.

It should feel like an operating query layer.

Examples:

```text
Hôm nay việc nào cần tôi quyết?
Ai đang bị kẹt nhiều nhất?
Khách nào có rủi ro?
Task nào quá hạn?
Tóm tắt project ABC.
```

Chat answers should be:

* Short
* Source-linked
* Action-oriented
* Clear about missing data
* Never speculative without saying so

---

# 12. Data Visualization

Use data visualization sparingly.

Do not turn Lumi into a dashboard-heavy product.

Allowed charts:

* Small weekly pulse completion trend
* Overdue tasks by team
* Risks by type
* Decisions waiting by age
* Commitments resolved vs overdue

Style:

* Minimal axes
* No rainbow palettes
* No 3D charts
* No decorative gradients
* Use Lumi Blue, Civic Navy, Archive Gray, Signal Amber

Default chart colors:

```css
--chart-primary: #0E3EB8;
--chart-secondary: #102A43;
--chart-muted: #CBD3DF;
--chart-warning: #F4A62A;
--chart-risk: #C2410C;
--chart-success: #1F7A4D;
```

---

# 13. Illustration and Imagery

## 13.1 Illustration Style

Use:

* Documents
* Briefing sheets
* Operating ledgers
* Checklists
* Evidence markers
* Thin annotation circles
* Structured work surfaces
* Simple geometric diagrams
* Paper textures
* Editorial layouts

Avoid:

* Robots
* Neural networks
* Holograms
* AI glow
* 3D mascots
* Floating dashboards
* Generic people illustrations
* Hyper-polished startup illustration packs

## 13.2 Photography

If using photography:

Use:

* Real work environments
* Natural light
* Editorial composition
* Real notebooks, papers, laptops
* Human hands reviewing documents
* CEO/founder desk scenes

Avoid:

* Stock call-center teams
* Overly smiling office people
* Fake diversity collage
* Futuristic blue-light rooms
* Corporate handshake photos

---

# 14. Motion Design

Motion should be calm and functional.

Use motion for:

* Loading brief generation
* Showing AI extraction progress
* Expanding evidence
* Revealing brief sections
* Completing tasks

Motion duration:

```css
--motion-fast: 120ms;
--motion-normal: 180ms;
--motion-slow: 260ms;
```

Easing:

```css
cubic-bezier(0.2, 0.8, 0.2, 1)
```

Avoid:

* Bouncy motion
* Sparkle animation
* AI typing theatrics
* Excessive loading animations
* Looping decorative motion

When Lumi generates a brief, use language:

```text
Lumi is reviewing yesterday’s updates...
Finding commitments...
Checking overdue items...
Preparing the CEO brief...
```

No magical animation needed.

---

# 15. Voice and Copy

## 15.1 Brand Voice

Lumi speaks like:

* A precise operating assistant
* A calm chief of staff
* A trustworthy analyst
* A clear editor

Lumi does not speak like:

* A motivational coach
* A hype AI tool
* A playful chatbot
* A corporate consultant using jargon

## 15.2 Copy Rules

Use:

* Short sentences
* Specific nouns
* Action verbs
* Clear ownership
* Evidence-based claims

Avoid:

* “Unlock productivity”
* “Supercharge your team”
* “10x your workflow”
* “AI-powered magic”
* “Revolutionize operations”
* “Seamlessly leverage synergy”

## 15.3 Preferred Language

Good:

```text
3 decisions are waiting for CEO review.
5 commitments are overdue.
ABC has not responded to a 120M VND quote for 6 days.
Finance needs to confirm the payment date today.
```

Bad:

```text
Your team has several exciting opportunities to improve operational excellence.
```

## 15.4 Vietnamese Copy Tone

Use:

```text
rõ
ngắn
thẳng
không quá Tây
không quá corporate
không dùng jargon AI
```

Example:

```text
Hôm nay có 3 việc cần CEO quyết.
```

Not:

```text
Lumi đã tối ưu hóa năng suất bằng trí tuệ nhân tạo để nâng cao hiệu quả vận hành.
```

---

# 16. Accessibility

Lumi must feel premium because it is usable.

## 16.1 Contrast

* Body text must meet WCAG AA
* Primary blue on white must pass
* Avoid pale gray text
* Do not use color alone to communicate risk

## 16.2 Font Size

Minimum body text:

```css
16px
```

Minimum metadata:

```css
12px
```

Daily pulse textareas should use:

```css
16px or 17px
```

## 16.3 Click Targets

Minimum tap/click target:

```css
40px height
```

Prefer:

```css
44px
```

## 16.4 Keyboard Navigation

All app controls must be reachable by keyboard:

* buttons
* links
* form fields
* modals
* dropdowns
* chat input

## 16.5 Focus States

Focus states must be visible.

```css
outline: 2px solid rgba(14, 62, 184, 0.45);
outline-offset: 2px;
```

---

# 17. Landing Page Direction

## 17.1 Landing Page Strategy

The landing page should not look like a typical AI startup page.

Avoid:

* Big 3D orb
* Gradient AI brain
* Floating cards everywhere
* Cartoon team workflow
* Fake dashboard overload

Use:

* Strong typography
* Warm paper background
* Product screenshots
* Short CEO-focused copy
* Evidence-based sections
* Calm structure

## 17.2 Hero

Hero copy:

```text
Run the company with a clearer morning brief.

Team updates, tasks, projects, and recurring work —
turned into a daily operating brief for the CEO.
```

Vietnamese version:

```text
Mỗi sáng, CEO nắm rõ công ty đang kẹt ở đâu.

Team cập nhật việc hằng ngày.
Lumi tổng hợp thành brief điều hành:
việc trễ, khách rủi ro, tiền kẹt,
và quyết định đang chờ.
```

CTA:

```text
Start a 14-day pilot
See example brief
```

## 17.3 Landing Page Structure

```text
1. Hero
2. Example Morning Brief
3. How Lumi Works
4. What Lumi Tracks
5. Who It Is For
6. Pilot Offer
7. FAQ
8. Final CTA
```

## 17.4 Example Section

Show a real-looking brief instead of abstract illustration.

```text
Today’s Lumi Brief

3 decisions need CEO review.
5 commitments are overdue.
2 customer risks need follow-up.
1 payment date needs confirmation.
```

This is more convincing than any AI illustration.

---

# 18. App Layout

## 18.1 Default App Layout

```text
┌──────────────────────────────────────────┐
│ Sidebar  │ Top bar                       │
│          ├───────────────────────────────┤
│          │ Page content                  │
│          │                               │
└──────────────────────────────────────────┘
```

Sidebar should be calm and structured.

Navigation groups:

```text
Work
- Today
- Projects
- Tasks
- Recurring

Lumi
- Daily Pulse
- CEO Brief
- Commitments
- Risks
- Decisions
- Chat

Admin
- Teams
- Settings
```

## 18.2 CEO Home

Default CEO route:

```text
/brief
```

CEO should not land on task lists first.

## 18.3 Member Home

Default member route:

```text
/today
```

Member should see:

* Today’s tasks
* Daily pulse reminder
* Assigned commitments
* Overdue items

---

# 19. Design Tokens

Use this base token file.

```css
:root {
  /* Brand */
  --color-lumi-blue: #0E3EB8;
  --color-lumi-blue-hover: #0B3397;
  --color-lumi-blue-soft: #EAF0FF;

  /* Text */
  --color-civic-navy: #102A43;
  --color-ink: #172033;
  --color-soft-slate: #667085;

  /* Surfaces */
  --color-paper-white: #FAF8F4;
  --color-surface-white: #FFFFFF;
  --color-archive-gray: #E7EAF0;
  --color-border: #D9DEE8;

  /* States */
  --color-signal-amber: #F4A62A;
  --color-amber-soft: #FFF4DC;
  --color-risk-red: #C2410C;
  --color-red-soft: #FFF1EC;
  --color-success-green: #1F7A4D;
  --color-green-soft: #E9F7EF;

  /* Typography */
  --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;

  /* Motion */
  --motion-fast: 120ms;
  --motion-normal: 180ms;
  --motion-slow: 260ms;
}
```

---

# 20. Tailwind Theme Guidance

Example Tailwind extension:

```js
export default {
  theme: {
    extend: {
      colors: {
        lumi: {
          blue: "#0E3EB8",
          hover: "#0B3397",
          soft: "#EAF0FF"
        },
        civic: {
          navy: "#102A43"
        },
        paper: {
          white: "#FAF8F4"
        },
        archive: {
          gray: "#E7EAF0"
        },
        signal: {
          amber: "#F4A62A"
        },
        risk: {
          red: "#C2410C"
        },
        success: {
          green: "#1F7A4D"
        }
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  }
};
```

---

# 21. Anti-Patterns

Do not use:

* AI glow
* Neon gradients
* Purple-blue startup gradient
* Glassmorphism
* Floating 3D dashboards
* Robot illustrations
* Brain icons
* Circuit board patterns
* Excessive sparkles
* Cartoon mascots
* Huge pill buttons
* Generic SaaS avatars
* Fake stock office photography
* Template landing page waves
* Dashboard overload
* Red-heavy fear UI
* Surveillance language

Do not say:

```text
AI-powered productivity revolution
10x your team
Supercharge your workflow
Command your company with AI
Automate your CEO
```

Say:

```text
Know what needs attention.
See what is stuck.
Turn daily updates into a morning brief.
Keep work clear without more meetings.
```

---

# 22. Unique Unconventional Edge

The unconventional move is restraint.

Most AI products try to look intelligent by adding:

* glow
* gradients
* magic
* animation
* chatbot bubbles
* fake dashboards

Lumi should look intelligent by showing:

* edited information
* source-backed insights
* strong typography
* calm surfaces
* evidence trails
* clear next actions
* human-readable operating memory

The product should feel like:

> A serious organization has reviewed the company’s operating signals and prepared a brief.

Not:

> A chatbot generated a summary.

That difference is the brand.

---

# 23. Example Product Copy

## Homepage hero

```text
A clearer morning brief for running the company.

Lumi turns daily team updates, tasks, projects, and recurring work
into a focused operating brief for the CEO.
```

## Vietnamese hero

```text
Mỗi sáng, CEO nắm rõ công ty đang kẹt ở đâu.

Team cập nhật việc hằng ngày.
Lumi tổng hợp thành brief điều hành:
việc trễ, khách rủi ro, tiền kẹt,
và quyết định đang chờ.
```

## Product description

```text
Lumi is an AI operating workspace for SME teams.
Team members update daily pulse, tasks, projects, and recurring work.
Lumi turns that information into commitments, risks, decisions,
and a morning brief for leadership.
```

## Empty state

```text
No brief yet.

Ask your team to submit today’s pulse.
Lumi will use those updates to prepare your first operating brief.
```

## Error state

```text
Lumi does not have enough information yet.

Try adding a daily pulse, task, or commitment.
```

## Low confidence state

```text
Lumi found this item, but the source is incomplete.
Please confirm before acting.
```

---

# 24. Design QA Checklist

Before shipping any page, check:

```text
[ ] Is the page calm?
[ ] Is the main action obvious?
[ ] Is there one clear message per section?
[ ] Is the text readable at 16px+?
[ ] Is the layout using enough whitespace?
[ ] Are colors restrained?
[ ] Are warnings not over-red?
[ ] Are Lumi-generated insights source-backed?
[ ] Is the logo used respectfully?
[ ] Does this feel like a serious operating assistant, not a toy?
[ ] Would a CEO understand the page in 5 seconds?
[ ] Would a designer see restraint and consistency?
```

---

# 25. Final Design Statement

Lumi’s design should be:

> Calm enough for daily use, serious enough for executive decisions, warm enough for teams, and precise enough to trust.

The logo already has the right foundation: institutional blue, geometric structure, and a clarity star.

Do not decorate it.

Build the whole product around what the logo already says:

> Structure. Clarity. Guidance. Trust.

