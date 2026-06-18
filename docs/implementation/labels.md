# Labels

Implemented in: `2026-06-18`

## Overview

Users can create color-coded labels and apply them to messages for organization beyond folders. Similar to Gmail labels.

## Schema

```sql
CREATE TABLE labels (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  organization_id TEXT,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6366f1',
  created_at INTEGER NOT NULL,
  UNIQUE(user_id, name)
);

CREATE TABLE message_labels (
  message_id TEXT NOT NULL,
  label_id TEXT NOT NULL,
  PRIMARY KEY(message_id, label_id)
);
```

## API

### Labels CRUD
```
GET    /api/labels                    — list user's labels
POST   /api/labels                    — create { name, color }
PATCH  /api/labels/[id]               — update { name?, color? }
DELETE /api/labels/[id]               — delete
```

### Message labels
```
GET    /api/messages/[id]/labels      — list labels on message
POST   /api/messages/[id]/labels      — apply { labelId }
DELETE /api/messages/[id]/labels      — remove { labelId }
```

## UI

- **Labels page**: `/labels` — manage labels with color swatches
- **Dashboard nav**: "Labels" link with Tag icon
- 8 preset colors available in the create form
