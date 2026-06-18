# Lumimail — Engineering Protocol

This project follows a **spec-first, test-driven, verification-first** workflow.
Code generation is not the end goal — correct, verified behavior is.

Lumimail is a single Next.js 16 (App Router) app deployed as a Cloudflare Worker via
OpenNext, with Drizzle ORM + D1, Tailwind v4, and Cloudflare Email Routing/Sending APIs.
There is no separate backend/frontend split — everything lives in `src/`.

## Required Lifecycle

```text
Spec → Tests → Implementation → Verification (typecheck, unit, E2E) → Spec Update
```

---

## 1. Core Rule

Before writing implementation code, locate, create, or update the relevant feature
spec in `docs/specs/F<NN>-<slug>.md`.

- If no spec exists, create one from `docs/specs/TEMPLATE.md`.
- If a spec exists but is incomplete, update it before implementation.
- If the requested change contradicts the current spec, stop and explicitly
  identify the contradiction before changing code.
- If the feature is not in `docs/MVP_SCOPE.md`, stop and ask — unlisted features
  are out of scope.

The spec is the contract. Do not silently reinterpret requirements.

---

## 2. Required Files and Structure

```
docs/
  ENGINEERING.md          # this file
  MVP_SCOPE.md            # feature registry — source of truth
  specs/
    TEMPLATE.md
    F<NN>-<slug>.md        # one per feature
  implementation/
    README.md              # plan index + execution protocol
    P<NN>-<slug>.md         # PR-by-PR implementation plans
  tests/
    README.md               # how tests are organized and run

tests/
  unit/                     # Vitest — pure functions, validators, hooks, route logic
  e2e/                      # Playwright — critical user journeys
```

Each meaningful feature has one spec file following `docs/specs/TEMPLATE.md`. For
large features, split by domain (e.g. `F04-mail-folders.md`,
`F07-routing-rules.md`), not by technical layer.

---

## 3. Mandatory Workflow

### Step 1 — Read Existing Context

Before editing code, inspect:

- The feature's registry entry in `docs/MVP_SCOPE.md`
- The feature spec in `docs/specs/F<NN>-<slug>.md`
- Relevant source files under `src/`
- Existing tests in `tests/unit/` and `tests/e2e/`
- The relevant Drizzle schema in `src/db/schema/`

Do not assume behavior from file names alone — read the route handler / component.

### Step 2 — Update or Create the Spec First

Before implementation, update the spec with: Current Behavior, Desired Behavior
(via User Stories & Acceptance Criteria), Edge Cases, Error States, Data Model /
API Contract changes, Permissions & Security, Test Plan, and a draft Bug/Change Log
entry.

The spec must be good enough that another agent could implement from it without
reading the original chat.

### Step 3 — Write Tests Before Implementation

- **Bug fix**: write a failing regression test first (`tests/unit/...`).
- **New feature**: write tests for the main behavior and important edge cases.
- **Refactor**: write characterization tests before changing behavior.
- **Permissions/security**: write both allowed and cross-tenant-denied tests.
- **Schema changes**: add a Drizzle migration in `drizzle/migrations/` and test it
  against `npm run db:migrate:local`.

Tests must verify behavior, not private implementation details.

### Step 4 — Confirm Test Failure

Run the relevant test and confirm it fails for the expected reason before writing
implementation code. If it passes before implementation, explain why — existing
behavior may already cover it, the test may be too weak, or the setup is wrong.

### Step 5 — Implement the Minimal Correct Change

- Do not rewrite unrelated code.
- Do not introduce new libraries, frameworks, or abstractions unless the spec
  requires them or the existing architecture clearly supports them.
- Follow existing conventions: route handlers in `src/app/api/**/route.ts`, Zod
  schemas in `src/lib/validators.ts`, IDs via `src/lib/ids.ts`, DB access via
  `getDb(env)` from `src/db/`.
- If implementation reveals the spec is wrong or incomplete, update the spec
  before continuing.

### Step 6 — Run Verification

Run, in order:

```bash
npm run typecheck      # tsc --noEmit
npm run lint           # next lint
npm run test:cov       # vitest run --coverage (100% on touched files)
npm run e2e            # playwright — for user-visible changes
```

Or run everything except E2E in one shot:

```bash
npm run verify
```

If a command cannot be run, state which command, why, and what risk remains.
Never claim verification that was not actually performed.

### Step 7 — Run or Update E2E Tests

Every user-visible feature or critical flow must have E2E coverage in
`tests/e2e/`. For UI work, verify:

- Main happy path
- Important failure path
- Loading state
- Empty state
- Permission-denied / logged-out state
- Mobile/responsive behavior, if relevant

### Step 8 — Update the Spec After Implementation

After code and tests pass, update the spec: Current Behavior, Edge Cases, Error
States, Data Model / API Contract, Test Plan, Decisions, and Bug/Change Log. Update
the feature's row in `docs/MVP_SCOPE.md` if routes, status, or tests changed.

### Step 9 — Final Response Format

```md
## Summary
- What changed

## Spec Updated
- Path to spec file
- Important spec changes

## Tests Added / Updated
- List tests

## Verification Run
- Commands run
- Results

## Risks / Not Verified
- Anything not verified
```

If nothing remains unverified, write: "No known unverified risks."

---

## 4. Definition of Done

- [ ] Relevant spec exists and is updated.
- [ ] Spec includes edge cases, error states, and a Bug/Change Log entry.
- [ ] `docs/MVP_SCOPE.md` row updated if routes/status/tests changed.
- [ ] Tests written before or alongside implementation; important edge cases
      covered.
- [ ] Implementation matches the spec.
- [ ] `npm run verify` passes (typecheck + lint + 100% coverage on touched files).
- [ ] Relevant E2E test passes, or manual E2E steps are documented with a reason.
- [ ] No unrelated code changed.
- [ ] Final response includes verification results.

---

## 5. Bug Fix Rule

```text
Reproduce → Spec bug entry → Failing regression test → Fix → Passing test → Verification → Spec update
```

The Bug/Change Log entry must include: what was broken (expected vs actual),
root cause (if known), fix summary, regression test added, verification performed.

Never fix a bug without adding a regression test unless technically impossible —
if so, explain why and document manual verification.

---

## 6. Change Log Rule

Every feature spec maintains its own Bug/Change Log. Format:

```
### YYYY-MM-DD — <Short title>

Type: Feature | Bug Fix | Refactor | Behavior Change | Breaking Change | Security Fix | Performance Fix | Documentation Change

Summary:
- What changed?

Reason:
- Why was this change needed?

Impact:
- Who or what is affected?

Tests:
- Which tests were added or updated?

Notes:
- Anything future agents must know.
```

---

## 7. Edge Case Rule

Every spec must consider: empty input, invalid input, missing/duplicate data,
permission denied, expired session, network/D1/R2/queue failure, timeout, retry,
race condition, large input/pagination, mobile layout, timezone/date boundary,
concurrent users, partial completion, user cancellation, Cloudflare API failure
(for domain/mailbox/sending features).

---

## 8. Permission and Security Rule

For any feature touching users, mailboxes, domains, messages, API keys, webhooks,
or Cloudflare credentials, the spec must answer:

- Who can perform this action (owner vs admin vs API key scope)?
- What data must never be exposed cross-tenant?
- What happens when permission is missing? (401/403 + no data leak)
- Is the action logged?
- Are Cloudflare tokens, API keys, or password hashes ever returned in a response?
  (must be no — verify with a test)

Cross-tenant isolation must be tested for every endpoint that reads or writes
mailbox/message/domain-scoped data.

---

## 9. AI / Agent-Specific Rules

Agents must not:

- Skip the spec because the change seems small.
- Write implementation before understanding current behavior.
- Modify tests only to make them pass, weaken assertions, or delete failing
  tests without explanation.
- Ignore edge cases or introduce unrelated refactors.
- Claim tests passed without running them.
- Leave specs stale.

Agents must:

- Prefer explicit behavior over clever abstraction.
- Preserve existing conventions unless there is a documented reason to change.
- Make minimal, reversible changes.
- Document assumptions and decisions in the spec.
- Verify behavior with executable tests.

---

## 10. Handling Ambiguity

If requirements are ambiguous, do not immediately code. Add an "Open Questions"
section to the spec. If the ambiguity blocks correct implementation, ask. If it
does not block implementation, make the safest reasonable assumption, document it
under Decisions, and continue.

Do not silently choose behavior that affects security, billing, permissions, data
loss, or user-visible contracts.

---

## 11. Tiny Change Exception

For trivial changes only — typo fixes, formatting-only edits, comments,
non-behavioral copy changes — the full workflow may be shortened. Even then:

- Do not change behavior accidentally.
- Update the spec if user-visible behavior changes.
- Run `npm run typecheck` if the touched area is risky.

A change is not "tiny" if it affects: logic, data, API behavior, permissions,
billing, authentication, user-visible flow, error handling, persistence, queues,
or Cloudflare integrations.

---

## 12. Default Agent Command

When asked to implement anything, internally follow:

```text
Start with the spec. Do not implement first.

Find or create docs/specs/F<NN>-<slug>.md.
Define current behavior, desired behavior, edge cases, error states, test plan.
Add a Bug/Change Log entry draft.
Write failing tests in tests/unit/ (and tests/e2e/ for user-visible flows).
Implement the smallest correct change.
Run npm run verify (and npm run e2e for user-visible changes).
Update the spec to match final behavior.
Update docs/MVP_SCOPE.md if applicable.
Report what was changed, tested, and not verified.
```
