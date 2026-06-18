# F02 — GitHub CI Auto Test

> Status: In Progress
> Owner area: `.github/workflows/`, `package.json`

## 1. Problem & User Job

Every push and PR to `main` should automatically run `npm run verify` (typecheck + lint + test:cov) so that regressions are caught before merge. The project currently has zero CI/CD automation.

## 2. User Stories & Acceptance Criteria

- As a contributor, I want a CI workflow that runs on every push and PR to `main` so broken code is flagged.
  - Given a push or PR targeting `main`, when the workflow triggers, then `typecheck`, `lint`, and `test:cov` all run and the job fails if any step fails.

## 3. Scope Boundaries

**In scope:**
- Single `.github/workflows/ci.yml` workflow
- Triggered on `push` and `pull_request` to `main`
- Runs `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test:cov`
- Uses Node.js 22.x (active LTS)

**Out of scope:**
- E2E tests via Playwright (requires Cloudflare bindings / D1 — needs separate setup)
- Deployment automation
- Matrix testing across Node versions
- Caching (can add later)

## 4. Data Model

N/A — no database changes.

## 5. API Contract

N/A — no API changes.

## 6. UI/UX

N/A — no UI changes.

## 7. Test Plan

| Layer | File | What it covers |
|-------|------|-----------------|
| CI | `.github/workflows/ci.yml` | Verifies the workflow YAML is valid by pushing a branch |

Manual verification:
- Push a branch to GitHub, open a PR to `main` — workflow must trigger and pass.
- Push a commit that breaks `typecheck` — workflow must fail.

## 8. Current Behavior

No CI/CD automation exists. All verification is done locally via `npm run verify`.

## 9. Error States

| Condition | User-visible message | HTTP status | Logged? |
|-----------|----------------------|--------------|---------|
| N/A — CI-only change | Job failure in GitHub Actions UI | N/A | GitHub Actions logs |

## 10. Edge Cases

- Workflow must not run on draft PRs unnecessarily (standard `pull_request` trigger handles this)
- `npm ci` must respect `package-lock.json` for reproducible installs
- `test:cov` enforces 100% coverage on included files — if coverage drops, CI must fail

## 11. Permissions & Security

- Read-only on repository contents
- No secrets required (no D1, no Cloudflare API tokens)
- No write access needed

## 12. Open Questions / Decisions

- E2E tests skipped for now → Decision: E2E requires D1/Cloudflare bindings; add separate workflow once local D1 emulation in CI is figured out. Date: 2026-06-10.
- Node version → Decision: 22.x (active LTS as of June 2026). Date: 2026-06-10.

## 13. Bug / Change Log

### 2026-06-10 — Initial CI workflow

Type: Feature

Summary: Added GitHub Actions CI workflow running typecheck + lint + test:cov on push/PR to main.

Reason: No automated testing existed.

Impact: Every push and PR to main now runs full verify gate.

Tests: Manually verified by pushing a branch.

Notes: E2E tests excluded — needs separate workflow with D1 emulation.
