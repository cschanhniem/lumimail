# Email Aliases

Implemented in: `2026-06-18`

## Overview

Org admins can create email aliases — addresses that forward to a mailbox or external address. A single alias can also serve as a group/distribution list.

## Schema

```sql
CREATE TABLE aliases (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  domain_id TEXT NOT NULL,
  local_part TEXT NOT NULL,
  target_mailbox_id TEXT,  -- route to internal mailbox
  forward_to TEXT,         -- route to external address
  is_group INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  UNIQUE(domain_id, local_part)
);
```

## API

```
GET    /api/aliases              — list org aliases (admin only)
POST   /api/aliases              — create { domainId, localPart, targetMailboxId?, forwardTo? }
DELETE /api/aliases/[id]         — delete (admin only)
```

## UI

- **Aliases page**: `/aliases` in admin panel
- Select domain + enter local part
- Choose: deliver to mailbox OR forward to external address
- List shows alias address, target, and delete button

## Use cases

- `support@company.com` → forwards to `alice@company.com` mailbox
- `info@company.com` → forwards to external `help@thirdparty.com`
- `team@company.com` → group list (future: multiple members)
