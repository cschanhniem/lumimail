# Reply & Forward

Gmail-style reply and forward from the message detail view.

## Behavior

- The message detail action bar (`src/components/message-actions/message-actions.tsx`)
  exposes **Reply** and **Forward** buttons.
- **Reply** navigates to `/compose` with query params:
  - `to` — the original sender (inbound) or recipient (outbound)
  - `subject` — prefixed with `Re: ` (unless already present)
  - `inReplyTo` — the source message id
- **Forward** navigates to `/compose` with:
  - `subject` — prefixed with `Fwd: ` (unless already present)
  - `forwardOf` — the source message id

## Compose prefill

`src/components/compose/compose-form.tsx` reads the URL params via
`useSearchParams`:

- `to` / `subject` populate the corresponding fields.
- When `inReplyTo` or `forwardOf` is present, the form fetches the original
  message body from `GET /api/messages/[messageId]` and appends a quoted block
  (`From:` / `Subject:` header + original text) to the compose body.
- Prefill is skipped when loading an existing draft (`draftIdToLoad`).
- Body fetch is best-effort: failures are swallowed so the user can still compose.

## Files

| File | Role |
|------|------|
| `src/components/message-actions/message-actions.tsx` | Reply/Forward buttons + navigation |
| `src/components/message-actions/types.d.ts` | `fromAddr`/`toAddr`/`subject` props |
| `src/components/compose/compose-form.tsx` | URL param prefill + quoted body |
| `src/app/api/messages/[messageId]/route.ts` | Source message + body |
