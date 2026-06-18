# Filters, Vacation Responder, Contacts & Password Change

Gmail-parity account features for inbound automation, out-of-office replies,
contact management, and credential self-service.

## Message filters

Rules evaluated against every inbound message in `src/lib/email/inbound.ts`
(`applyMessageFilters`).

- **Conditions:** `fromContains`, `toContains`, `subjectContains`, `hasWords`
  (matches subject or sender). Empty conditions are treated as "match".
- **Actions:** star, mark read, archive, move to trash, apply label.
- Disabled filters are skipped. All conditions must match (AND).

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/filters` | GET / POST | List / create filters |
| `/api/filters/[id]` | DELETE / PATCH | Delete / enable-disable |

UI: `src/app/(dashboard)/filters/page.tsx`.

## Vacation responder

`maybeVacationRespond` in `src/lib/email/inbound.ts` runs after inbound storage.

- Skips senders containing `noreply`/`no-reply`.
- Respects enabled flag and optional `startDate`/`endDate` window.
- Sends a single auto-reply via `sendEmail` (best-effort).

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/vacation` | GET / PUT | Read / upsert (one per user) |

UI: `src/components/settings/vacation-responder-form.tsx`.

## Contacts

Auto-captured from inbound/outbound mail (`upsertContactFromAddress`) and
manually addable.

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/contacts` | GET / POST | List (100, recent first) / create-upsert |

UI: `src/app/(dashboard)/contacts/page.tsx` with search and source badges.

## Password change

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/change-password` | POST | Verify current password, set new (min 8) |

- Verifies `currentPassword` against the stored bcrypt hash before updating.
- UI: `src/components/settings/change-password-form.tsx` on the settings page.

## Schema

`messageFilters` and `vacationResponders` tables
(`drizzle/migrations/0006_spicy_tony_stark.sql`); `contacts` table
(`0003`/`0004`).
