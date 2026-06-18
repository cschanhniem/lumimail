# Lumimail Design System

A civic editorial design system for a self-hosted email platform. Email interfaces
are dense, utilitarian, and often ugly. Lumimail takes the opposite approach:
typography-driven, spacious but not wasteful, quiet but not cold.

## Design philosophy

**Civic editorial minimalism.** Think public radio website meets high-end print
magazine — serious, trustworthy, and a pleasure to read. This is not a SaaS
dashboard. It's not a consumer app. It's infrastructure that respects the reader.

Three pillars:

1. **Typography is the UI.** Layout decisions flow from the reading experience.
   Spacing, hierarchy, and rhythm derive from type scale, not from a component
   library. Every pixel of whitespace serves legibility.

2. **Restraint is the brand.** Fewer colors, fewer borders, fewer shadows. When
   something is interactive, show it. When something is static, stay out of the
   way. The interface should feel calm, not busy.

3. **Tools, not toys.** Buttons don't delight. They work. Forms don't spark joy.
   They get out of the way. The product is the email — the chrome should be
   nearly invisible during focused reading.

## Color system

### Base palette

| Token | Value | Usage |
|-------|-------|-------|
| `--surface` | `#fafaf8` | Page background (warm off-white — avoids clinical pure white) |
| `--surface-raised` | `#ffffff` | Cards, dialogs, dropdowns |
| `--surface-subtle` | `#f4f4f0` | Sidebar, secondary regions |
| `--ink` | `#1a1a18` | Primary text (not pure black — softer on eyes) |
| `--ink-muted` | `#6b6b65` | Secondary text, metadata |
| `--ink-faint` | `#9a9a92` | Placeholder, disabled |
| `--border` | `#e6e6e0` | Dividers, card borders |
| `--border-strong` | `#d4d4ce` | Input borders, focus rings when not focused |
| `--accent` | `#2563eb` | Links, primary actions, selection (royal blue — strong but not garish) |
| `--accent-muted` | `#dbeafe` | Selected row backgrounds, hover states |
| `--danger` | `#dc2626` | Delete, error, destructive actions |
| `--success` | `#16a34a` | Confirmation, sent status |

### Dark mode

Dark mode inverts the surface/ink relationship but preserves the typographic
hierarchy. Surface becomes `#111110`, ink becomes `#f0f0ee`. Accent shifts to
`#3b82f6` (slightly brighter for dark backgrounds). Never use pure black
(`#000`) or pure white (`#fff`) in dark mode.

### Color rules

- Never use color alone to convey meaning. Always pair with an icon or label.
- The accent color is used sparingly — one or two elements per view maximum.
- Backgrounds are never colorful. Only text, icons, and borders carry color.
- Gradients are banned. Transitions between states use opacity, not hue shifts.

## Typography

### Type scale

The type scale is rooted in a modular scale (1.25 ratio) starting from 16px:

| Step | Size | Line height | Usage |
|------|------|-------------|-------|
| `text-xs` | 0.75rem (12px) | 1.5 | Timestamps, badges, meta |
| `text-sm` | 0.875rem (14px) | 1.5 | Body small, labels, sidebar |
| `text-base` | 1rem (16px) | 1.6 | Body, form inputs, message list |
| `text-lg` | 1.25rem (20px) | 1.5 | Message subject, card titles |
| `text-xl` | 1.5rem (24px) | 1.4 | Section headings |
| `text-2xl` | 1.875rem (30px) | 1.3 | Page titles |
| `text-3xl` | 2.25rem (36px) | 1.2 | Hero, marketing only |

### Font stack

```
Geist (sans-serif) — UI, labels, navigation, buttons
Geist Mono — email bodies in plaintext mode, code, API keys
```

- System font stack fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- Monospace fallback: `"SF Mono", "Fira Code", "Fira Mono", "Roboto Mono", monospace`

### Typography rules

- Body text never goes below `text-sm`. If you need smaller, reconsider the
  information architecture.
- Line height is always at least 1.5 for body text. Tighter for headings only.
- Letter spacing is never negative. Tracking is never adjusted.
- ALL CAPS is reserved for 2 places: keyboard shortcuts (badges) and section
  overlines in the sidebar. Never for buttons or labels.
- Font weight changes (regular → medium → semibold) are the primary way to
  establish hierarchy. Color is secondary.

## Spacing

### Spacing scale

8px base grid, scaled in multiples:

| Token | Value | Usage |
|-------|-------|-------|
| `s-1` | 4px (0.25rem) | Icon-to-text gap, tight groups |
| `s-2` | 8px (0.5rem) | Internal padding, list item gap |
| `s-3` | 12px (0.75rem) | Compact section padding |
| `s-4` | 16px (1rem) | **Default spacing.** Card padding, section gap |
| `s-5` | 20px (1.25rem) | Expanded section padding |
| `s-6` | 24px (1.5rem) | Page-level padding |
| `s-8` | 32px (2rem) | Major section separation |
| `s-10` | 40px (2.5rem) | Hero, landing |
| `s-16` | 64px (4rem) | Page-level breathing room |

### Spacing rules

- The default gap between related elements is `s-4` (16px). Don't invent custom
  values.
- Sidebar width is fixed at 260px. Message list at 360px. Reading pane fills
  the rest. These are not responsive — below 768px, switch to mobile nav.
- Forms use `s-3` between label and input, `s-4` between fields.
- Card padding is always `s-4` (16px). Tighter padding signals a cramped
  interface.

## Borders & Dividers

- Cards have a single `1px solid var(--border)` border. No shadow.
- Hover state on cards: border changes to `var(--border-strong)`.
- Section dividers are `1px solid var(--border)` with `s-4` vertical margin.
- Input borders are `1px solid var(--border-strong)` in rest state, `2px solid
  var(--accent)` in focus state (the extra 1px must not cause layout shift —
  use `outline` or `box-shadow` inset).
- Border radius: `6px` for cards, inputs, buttons. `8px` for dialogs. `9999px`
  for pills/badges.

## Interactive elements

### Buttons

Three variants, no more:

1. **Primary** — `bg-[var(--accent)] text-white` — one per view, for the main
   action. Hover: 10% darker. Disabled: 40% opacity.
2. **Secondary** — `border border-[var(--border-strong)] text-[var(--ink)]` —
   for alternative actions. Hover: `bg-[var(--surface-subtle)]`.
3. **Ghost** — transparent, ink-colored text — for low-priority or repeated
   actions (icon buttons in message toolbar). Hover:
   `bg-[var(--surface-subtle)]`.

Button height: `h-9` (36px) for most actions. `h-8` (32px) for icon-only
buttons. `h-7` (28px) for toolbar icon buttons.

### Links

Inline links use `text-[var(--accent)]` with no underline by default. Underline
appears on hover. Navigation links use `text-[var(--ink-muted)]` with no
underline, shift to `text-[var(--ink)]` on hover.

### Inputs

All text inputs, selects, and textareas share the same visual treatment: `h-9`
default, `border border-[var(--border-strong)]`, `rounded-[6px]`, `px-3`.
Background is `var(--surface-raised)`. Placeholder uses `var(--ink-faint)`.

### Focus

All interactive elements get a visible focus ring: `outline-2 outline-offset-2
outline-[var(--accent)]`. Never remove focus styles. Never use `:focus` alone
without `:focus-visible` — mouse users shouldn't see rings on click.

## Icons

Lucide icons at 18px for UI chrome, 16px for inline with text, 14px for badges
and dense lists. Icons in buttons align to text via `flex items-center gap-2`.

Icon-only buttons must have an `aria-label`. Icon + text buttons should not —
the text is the label.

## Motion

- Transitions are 150ms ease-out. Never slower than 200ms.
- Hover state changes (color, background, border) transition. Layout changes
  (width, height, position) do not.
- Content appearing (dialogs, dropdowns) uses a 150ms fade + slight scale
  (0.97→1). No slide animations. No bounces. No spring physics.
- Page navigations: no transition. Email is a document-based medium. Full page
  transitions feel like an app, not a tool.

## Empty states

Empty states are treated as a design feature, not an afterthought. Every list,
folder, and view has a designed empty state:

- A single line of descriptive text in `text-[var(--ink-muted)]`, centered.
- An optional illustration or icon (24px, `var(--ink-faint)`) above the text.
- A clear action if the empty state is actionable (e.g., "Create your first
  mailbox" with a secondary button).

Never show "No results found" without context. Always explain why and offer a
path forward.

## Layout principles

### Three-column email layout

```
[Sidebar 260px] [Message list 360px] [Reading pane flex-1]
```

On screens < 1024px, collapse to two-column (no reading pane until a message is
selected). On screens < 768px, single column with bottom nav.

### Sidebar

- Fixed 260px width, full height, left-aligned.
- Background: `var(--surface-subtle)`.
- Sections separated by a 1px `var(--border)` divider with `s-4` vertical
  margin.
- Active item: `bg-[var(--accent-muted)] text-[var(--accent)] font-medium`.
- Inactive item: `text-[var(--ink-muted)]`, hover shifts to `text-[var(--ink)]`
  with `bg-[var(--surface)]`.

### Reading pane

- Maximum content width: 680px, centered.
- Message body rendered in the reader's preferred format (HTML or plaintext).
- HTML email is sanitized and rendered in a constrained viewport.
- Reply/all/forward buttons at the top of the reading pane, not bottom.

## Dark mode approach

Dark mode is not a toggle or preference. It's a system-level media query
(`prefers-color-scheme: dark`) with no manual override. Email is read at all
hours — respect the OS setting and don't ask the user to choose.

## Implementation notes

- Tailwind v4 with CSS-based config in `src/app/globals.css`. Use `@theme` to
  define the design tokens.
- Colors are CSS custom properties (`var(--surface)`, `var(--ink)`, etc.) so
  they can be referenced in both Tailwind and inline styles.
- shadcn/ui components (Radix primitives) are styled to match this system.
  Override their defaults in `src/app/globals.css` using `[data-slot]`
  selectors.
- The `cn()` utility from `src/lib/utils.ts` is the only class merging utility.
