# Attachments

Implemented in: `2026-06-18`

## Overview

File attachments are stored in Cloudflare R2 and linked to messages. Compose supports attaching files before sending; the viewer shows download links.

## Schema

```sql
CREATE TABLE attachments (
  id TEXT PRIMARY KEY,
  message_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  r2_key TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
```

## Storage

Files stored in R2 bucket (`BUCKET` binding) under:
```
attachments/{userId}/{messageId}/{attachmentId}/{filename}
```

Max file size: 25MB per file.

## API

### Upload (after sending)
```
POST /api/attachments
Content-Type: multipart/form-data
{ file: <File>, messageId: <string> }
→ { id, filename, size, contentType }
```

### Download
```
GET /api/attachments/[id]
→ streams file with Content-Disposition: attachment
```

### List for message
```
GET /api/messages/[messageId]/attachments
→ { attachments: [{ id, filename, contentType, size }] }
```

## Compose flow

1. User clicks paperclip icon → selects files
2. Files shown as chips in compose form
3. User clicks Send → message created via POST /api/send
4. Each file uploaded to POST /api/attachments with returned messageId
5. Upload status shown while in progress

## Security

- Download endpoint verifies message belongs to authenticated user
- Content-Disposition forces download (no inline HTML rendering)
- Cache-Control: private, max-age=3600
