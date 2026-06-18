# Lumimail Taste Guide

Anti-slop frontend engineering rules. Counterweights to the generic AI aesthetic.

## Layout

- **The three-column layout is sacred.** Sidebar is fixed at 260px. Message list at 360px. Never make these responsive — below 1024px, switch to two-column. Below 768px, single column with bottom nav. Never shrink the sidebar to fit more content.
- **Maximum content width in reading pane is 680px.** Not 720, not 640. If text is wider than 680px, it becomes harder to read at standard font sizes. Wrap it.
- **Cards don't have shadows.** An email interface is not a dashboard. Shadows create depth where none is needed. Use borders (`1px solid var(--border)`) and subtle background changes instead.
- **Never center-align text in the UI chrome.** Labels, nav items, buttons are left-aligned. Only empty states and marketing pages use center alignment.

## Color

- **Backgrounds are never colorful.** Only text, icons, and borders carry color. If you find yourself setting a background color to anything other than a surface token, stop.
- **Accent color dosage: one element per view.** If the accent blue appears on more than one or two UI elements in the same viewport, you've overused it. The primary button on a form? Yes. The selected nav item? Yes. A badge, a link, and a button all in the same area? No.
- **No gradients.** Period. No gradient backgrounds, no gradient text, no gradient borders.
- **Never use `#000` or `#fff`.** Use `var(--ink)` and `var(--surface-raised)` instead. Pure black and white look synthetic on screens.

## Typography

- **ALL CAPS is a last resort.** Reserved for keyboard shortcut badges and section overlines in the sidebar. Never for button text, nav labels, or headings.
- **Body text minimum is `text-sm`.** If you need smaller, your information architecture is wrong.
- **Line height for body text is never below 1.5.** Tighter is for headings only.
- **Font weight changes > color changes for hierarchy.** A bold label is more readable than a colored label. A light secondary text is better than a differently-colored one.

## Interaction

- **Hover states that change layout are broken.** Transitions on color, background, border only. Never transition width, height, padding, margin, or position.
- **Transitions are 150ms ease-out. Never slower.**
- **Focus rings are mandatory.** Every interactive element gets `outline-2 outline-offset-2 outline-[var(--accent)]` on `:focus-visible`. Never use `:focus` alone — it shows rings on click.
- **No slide animations, no spring physics, no bounces.** Content appears with a 150ms fade + 0.97→1 scale. That's it.

## Empty states

- **Every list and folder has a designed empty state.** Not a fallback, not a generic message. A specific line of text explaining what's missing and (if actionable) a button to fix it.
- **Never say "No results found" alone.** Always add context: what was searched, where, and what to try next.

## Component anti-patterns

- **No gradient buttons.** Primary buttons are solid `var(--accent)`. Secondary are bordered. Ghost are transparent.
- **No badge colors.** All badges use `var(--surface-subtle)` background with `var(--ink-muted)` text. Severity is expressed through an icon or label prefix, not color.
- **No toast notifications.** Use inline status messages or banner notifications that don't interrupt. Toasts are for consumer apps, not tools.
- **No skeleton screens.** Show the previous state or a brief loading indicator. Skeleton screens are a design pattern for entertainment apps, not email.
- **No empty-state illustrations.** A single icon (24px, `var(--ink-faint)`) + a line of text is sufficient. Illustrations make empty states feel like a designed destination rather than a state to move past.

## Dark mode

- **No manual toggle.** System preference only (`prefers-color-scheme: dark`). Email is read at 2 AM and 2 PM. Respect the OS.
- **Dark mode background is `#111110`, not `#000`.** Text is `#f0f0ee`, not `#fff`.
