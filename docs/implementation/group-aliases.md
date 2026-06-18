# Group Aliases & Fan-out Delivery

`team@domain.com`-style aliases that deliver one copy of an inbound message to
every member, mirroring Google Workspace groups.

## Model

- An **alias** (`aliases` table) belongs to a domain and has a `localPart`.
  - Simple alias: `targetMailboxId` (internal) or `forwardTo` (external).
  - Group alias: `isGroup = true`, members listed in `groupMembers`.
- A **group member** (`groupMembers` table) references either an internal
  `userId` or an external `email`.

## Resolution

`resolveInboundTargets(db, toAddress)` in `src/lib/email/routing.ts`:

1. Resolves the domain (must be `active`).
2. Looks up an alias matching the local part.
3. For a group alias, loads members and resolves each internal `userId` to its
   mailbox **on the alias domain**; members without a mailbox fall back to their
   external email.
4. Delegates to the pure `expandAliasTargets()` (`src/lib/email/alias-targets.ts`)
   which normalizes and de-duplicates targets into `{ type: "mailbox" }` /
   `{ type: "forward" }`.
5. If no alias matches, falls back to `resolveInboundAddress()` (routing rules +
   direct mailbox), so existing behavior is unchanged.

## Delivery

`processInboundMessage` (`src/lib/email/inbound.ts`):

- Parses the raw MIME **once**, then calls `deliverToMailbox` per mailbox target,
  storing a separate message + body row for each recipient and running filters,
  webhooks, and the vacation responder per mailbox.
- Forward targets are logged for the sending pipeline.

## Tests

`tests/unit/lib/email/alias-targets.test.ts` covers simple/group/forward/dedupe
cases at 100% (gated in `vitest.config.ts`).

## Files

| File | Role |
|------|------|
| `src/lib/email/alias-targets.ts` | Pure target expansion (tested) |
| `src/lib/email/routing.ts` | `resolveInboundTargets` alias resolution + fan-out |
| `src/lib/email/inbound.ts` | Per-mailbox delivery loop |
