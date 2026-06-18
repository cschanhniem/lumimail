# F02 — Domain Management

> Status: Shipped
> Owner area: `src/app/api/domains/*`, `src/lib/domains/`, `src/app/(admin)/domains/`

## 1. Problem & User Job

Users need to connect their Cloudflare domains to Lumimail for email routing and sending. The admin provisions domains via the Cloudflare API, and the system manages DNS records automatically.

## 2. User Stories & Acceptance Criteria

- As an admin, I can add a Cloudflare domain to my workspace.
  - Given I enter a hostname, when I submit, then Cloudflare routing + sending DNS records are provisioned for that zone, and the domain appears in my domain list.
- As an admin, I can view DNS status for each domain (routing + sending).
  - Given I click "DNS" on a domain card, the current MX/TXT records and any missing records are shown.
- As an admin, I can remove a domain, cleaning up Cloudflare routing rules.
  - Given I click the trash button on a domain, when confirmed, routing rules and sending subdomain are removed from Cloudflare and the domain row is deleted.

## 3. Scope Boundaries

**In scope:** Add domain (Cloudflare provisioning), list domains with DNS status, view DNS details per domain, remove domain with cleanup.

**Out of scope:** Edit domain fields (PATCH), non-Cloudflare domains, DNS propagation monitoring.

## 4. Data Model

| Table | Columns touched | Notes |
|-------|------------------|-------|
| `domains` | `id`, `userId`, `organizationId`, `hostname`, `zoneId`, `status`, `routingStatus`, `sendingSubdomainTag`, `sendingEnabled`, `routingEnabled` | |

## 5. API Contract

| Method | Route | Auth | Request | Response | Errors |
|--------|-------|------|---------|----------|--------|
| GET | `/api/domains` | `guardUser` | query: `?includeDns=true` | `{ domains[], dns? }` | 401 |
| POST | `/api/domains` | `guardUser` | `{ hostname, enableRouting?, enableSending? }` | `{ domain, dns }` | 400, 400 (duplicate) |
| GET | `/api/domains/[id]/dns` | `guardUser` | — | `{ routing: { records, missing, status }, sending }` | 401, 404 |
| DELETE | `/api/domains/[id]` | `guardUser` | — | `{ ok }` | 401, 404 |

## 6. UI/UX

- `/domains` — card grid: hostname, status badge, DNS button, trash button
- DNS card expands inline showing routing records, sending DNS, and any missing records
- "New domain" modal dialog with hostname input
- Empty state: "No domains yet"

## 7. Current Behavior

- `listUserDomains()` scopes by `userId`
- `addDomainForUser()` provisions via Cloudflare API, inserts/updates domain row
- `removeDomainForUser()` cleans up Cloudflare routing rules + sending subdomain, then deletes row
- `getDomainDns()` fetches live DNS status from Cloudflare

## 8. Known Gaps

- No PATCH route to toggle routing/sending post-creation
- Scoped by `userId`, not `organizationId` (to be changed in F12)

## 9. Bug / Change Log

### 2026-06-10 — Backfill spec from existing implementation

Type: Documentation Change. No code changes.
