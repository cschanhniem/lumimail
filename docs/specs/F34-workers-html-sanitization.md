# F34 — Workers-compatible HTML sanitization

> Status: Shipped
> Owner area: `src/lib/email/sanitize.ts`, `src/lib/email/parse.ts`, `src/app/(dashboard)/inbox/[messageId]/page.tsx`

## 1. Problem & User Job

Incoming email HTML is sanitized before storage (`parse.ts`) and before render
(`inbox/[messageId]`). Sanitization used `isomorphic-dompurify`, whose
jsdom/browser builds assume a DOM (`window`/`document`). The Cloudflare Workers
runtime has no global DOM, so the module **throws at import** during Worker
startup:

```
Uncaught TypeError: Cannot read properties of undefined (reading 'bind')
  at isomorphic-dompurify/dist/browser.mjs  →  src/lib/email/parse.ts
```

This makes the deployed Worker fail to boot (`wrangler deploy` validation error
`10021`), so inbound mail cannot be processed. The job is: sanitize HTML safely
in **both** the Worker (no DOM) and the browser.

## 2. User Stories & Acceptance Criteria

- As an operator, the Worker boots and processes inbound mail.
  - Given a deployed Worker, when it starts, then importing the email parser
    does not throw.
- As a user, HTML email is still sanitized (no XSS) on storage and on render.
  - Given hostile HTML (`<script>`, `onerror=`, `javascript:`), when parsed or
    rendered, then dangerous content is stripped.

## 3. Scope Boundaries

**In scope:**
- Replace `isomorphic-dompurify` with `dompurify` + `linkedom` (a pure-JS DOM
  that runs on Workers) behind a server-only `sanitizeHtml()` helper.
- Browser code (`"use client"` inbox page) uses `dompurify` with the native
  `window` directly.

**Out of scope:**
- Changing the sanitization policy/allowlist (behavior parity with DOMPurify
  defaults is preserved).
- Any other email parsing behavior.

## 4. Data Model

No schema changes. `messageBodies.htmlBody` continues to store sanitized HTML.

## 5. API Contract

No HTTP contract change. Internal helper:

```ts
// src/lib/email/sanitize.ts (server/Worker only)
export function sanitizeHtml(html: string | null | undefined): string | null
```

## 6. UI/UX

No visible change. The inbox message body still renders sanitized HTML.

## 7. Test Plan

| Layer | File | What it covers |
|-------|------|-----------------|
| Existing | `tests/unit/lib/email/*` | parser/reply-content unit tests continue to pass (they import `parse.ts`, which now pulls the linkedom-backed sanitizer under Vitest/Node) |
| Manual | deploy | Worker boots; inbound HTML mail is stored sanitized; inbox renders it |

No new coverage-gated files. `npm run verify` (typecheck + lint + test:cov)
remains green.

## 8. Current Behavior

`parse.ts` and the inbox page imported `isomorphic-dompurify`. Sanitization
worked in `next dev`/Node (jsdom) and in tests, but the production Worker bundle
loaded the browser build and crashed at import on Cloudflare Workers.

## 9. Error States

| Condition | User-visible message | HTTP status | Logged? |
|-----------|----------------------|--------------|---------|
| (before fix) Worker import crash | Worker fails to deploy/boot | n/a (deploy `10021`) | wrangler error |

After the fix the import path no longer throws; sanitization failures are not
expected (DOMPurify returns a string for any input).

## 10. Edge Cases

- `null`/`undefined`/empty HTML → returns `null` (unchanged).
- Hostile HTML → stripped by DOMPurify defaults.
- Browser vs Worker → browser uses native `window` via `dompurify`; Worker uses
  the `linkedom` window via `sanitize.ts`. The client page does not import
  `sanitize.ts`, so `linkedom` is not pulled into the browser bundle.

## 11. Permissions & Security

- Security-relevant: this is the XSS boundary for rendered mail. The fix
  preserves DOMPurify-default sanitization; only the DOM backing the sanitizer
  changed (jsdom/browser → linkedom on the server).
- No secrets involved. No cross-tenant surface.

## 12. Open Questions / Decisions

- Why `linkedom` over jsdom → **Decision:** jsdom depends on Node internals
  unavailable on Workers; `linkedom` is pure JS and runs on the Workers runtime.
  (2026-06-18)

## 13. Bug / Change Log

### 2026-06-18 — Workers-compatible HTML sanitization

Type: Bug Fix

Summary:
- Added `src/lib/email/sanitize.ts` using `dompurify` + `linkedom`.
- `parse.ts` now imports `sanitizeHtml` from it (removed direct
  `isomorphic-dompurify` import).
- Inbox client page imports `dompurify` directly (native browser DOM).
- Replaced `isomorphic-dompurify` with `dompurify` + `linkedom` in `package.json`.

Reason:
- `isomorphic-dompurify` crashes at import on the Cloudflare Workers runtime
  (no global DOM), preventing the Worker from booting.

Impact:
- Worker deploys and boots; inbound mail processing and inbox rendering keep
  DOMPurify-default sanitization. No schema/API/UX changes.

Tests:
- `npm run verify` green (typecheck + lint + 100% coverage on included files).
- Verified live: Worker deploys and boots on Cloudflare Workers.
