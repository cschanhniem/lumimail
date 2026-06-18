# F06 — API Keys

> Status: Shipped
> Owner area: `src/app/api/api-keys/`, `src/app/api/v1/`, `src/app/(admin)/api-keys/`, `src/lib/api/auth.ts`

## 1. Problem & User Job

Users need programmatic access to send and read email. API keys with scoped permissions provide
an alternative to session cookies for CI/CD, scripts, and integrations.

## 2. User Stories & Acceptance Criteria

- As a user, I can create an API key with `send` + `read` scopes.
  - Given I enter a name and click create, a key is generated and shown once.
- As a user, I can list my existing API keys (prefix + name + scopes).
- As an API consumer, I can send email via `/api/v1/send` with a valid API key.

## 3. Scope Boundaries

**In scope:** Create API key (send+read scopes), list keys. Send via v1 API.

**Out of scope:** Delete/revoke keys, update key name/scopes, read mail via v1 API, custom scopes.

## 4. Data Model

| Table | Columns touched | Notes |
|-------|------------------|-------|
| `apiKeys` | `id`, `userId`, `organizationId`, `name`, `prefix`, `keyHash`, `scopes`, `lastUsedAt` | |

## 5. API Contract

| Method | Route | Auth | Request | Response | Errors |
|--------|-------|------|---------|----------|--------|
| GET | `/api/api-keys` | `guardUser` | — | `{ keys[] }` (prefix, never full key) | 401 |
| POST | `/api/api-keys` | `guardUser` | `{ name }` | `{ id, name, prefix, fullKey, scopes }` | 401, 400 |

### v1 Send

| Method | Route | Auth | Request | Response | Errors |
|--------|-------|------|---------|----------|--------|
| POST | `/api/v1/send` | Bearer API key | `{ from, to, subject, html?, text? }` | `{ messageId }` | 401, 403, 400, 429 |

## 6. UI/UX

- `/api-keys` — card grid: name, prefix (`ep_key_abcdef...`), scope badges
- "New API key" dialog: name input, generates key shown once with "Copy" button
- Empty state: "No API keys yet"

## 7. Current Behavior

- `generateApiKey()` creates a nanoid prefixed `ep_key_`, bcrypt-hashes it, stores `keyHash` + `prefix`
- `authenticateApiKey()` looks up by prefix (first 12 chars), verifies hash, updates `lastUsedAt`
- `requireScope()` checks scope array contains required scope or `*`
- No delete/revoke route — once created, a key can't be deleted via API or UI

## 8. Known Gaps

- No DELETE route (can't revoke keys)
- No PATCH route (can't rename or change scopes)
- No single-key GET route

## 9. Bug / Change Log

### 2026-06-10 — Backfill spec from existing implementation

Type: Documentation Change. No code changes.
