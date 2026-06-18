# F<NN> — <Feature Name>

> Status: `Draft | In Progress | Shipped | Deprecated`
> Owner area: `src/app/api/<...>`, `src/app/(dashboard|admin)/<...>`, `src/components/<...>`

## 1. Problem & User Job

What user problem does this solve? Who is the user (mailbox owner, admin, API consumer)?

## 2. User Stories & Acceptance Criteria

- As a `<role>`, I can `<action>` so that `<outcome>`.
- Acceptance criteria (Given/When/Then), one per behavior.

## 3. Scope Boundaries

**In scope:**
-

**Out of scope:**
-

## 4. Data Model

Reference the Drizzle tables in `src/db/schema/` this feature reads/writes. Note new
columns/tables and migration files under `drizzle/migrations/`.

| Table | Columns touched | Notes |
|-------|------------------|-------|

## 5. API Contract

| Method | Route | Auth | Request | Response | Errors |
|--------|-------|------|---------|----------|--------|

Validation schemas live in `src/lib/validators.ts` (Zod). New schemas go there.

## 6. UI/UX

- Routes: `src/app/(dashboard|admin)/...`
- Components touched
- Loading / empty / error states
- Mobile/responsive notes

## 7. Test Plan

| Layer | File | What it covers |
|-------|------|-----------------|
| Unit | `tests/unit/...` | pure logic, validators, utils |
| Integration | `tests/unit/...` or `tests/integration/...` | API route handlers against a test D1 DB |
| E2E | `tests/e2e/...` | critical user journey via Playwright |

Coverage target: 100% for new/changed files in `src/`.

## 8. Current Behavior

How the system behaves today. Write "No existing behavior — new feature" for net-new work.

## 9. Error States

| Condition | User-visible message | HTTP status | Logged? |
|-----------|----------------------|--------------|---------|

## 10. Edge Cases

- Empty input
- Invalid input
- Missing/duplicate data
- Permission denied / cross-tenant access
- Expired session
- Network / D1 / R2 / queue failure
- Race condition / concurrent writes
- Large input (pagination limits)
- Mobile viewport
- Cloudflare API failure (for domain/mailbox features)

## 11. Permissions & Security

- Who can perform this action? (owner, admin, API key scope)
- What must never be exposed cross-tenant?
- Is the action logged/audited?
- Are secrets (CF_TOKEN, API keys) ever returned in responses? (must be no)

## 12. Open Questions / Decisions

- Question → Decision → Date

## 13. Bug / Change Log

### YYYY-MM-DD — <Short title>

Type: `Feature | Bug Fix | Refactor | Behavior Change | Breaking Change | Security Fix | Performance Fix | Documentation Change`

Summary:
-

Reason:
-

Impact:
-

Tests:
-

Notes:
-
