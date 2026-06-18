# Lumimail IMAP/SMTP Bridge — Real Mail Clients, Zero Compromise

**The bridge is the part everyone else skips.** Plenty of self-hosted webmail projects give you a browser tab and call it a day. Lumimail gives you the browser tab *and* the protocols every real client speaks — so Apple Mail, Thunderbird, Outlook, and the stock iOS/Android mail apps connect like Lumimail were Gmail itself.

It speaks **IMAP4rev1** and **SMTP**. Your client doesn't know — or care — that mail actually lives in Cloudflare D1 and R2 behind an HTTP API.

## How it works

A lightweight Node.js TCP server implements IMAP4rev1 and SMTP and proxies every operation to the Lumimail HTTP API. It runs beside the Cloudflare Workers app (Workers can't open raw TCP sockets — so the bridge does, and translates). Authenticate with a Lumimail API key as the password; nothing else to configure on the client.

## Quick start

### 1. Configure

```bash
cp .env.example .env
# Edit .env — set LUMIMAIL_API_URL to your Lumimail deployment URL
```

### 2. Run with Docker

```bash
docker build -t lumimail-bridge .
docker run -p 143:143 -p 587:587 --env-file .env lumimail-bridge
```

For TLS (recommended for production):

```bash
docker run \
  -p 993:993 -p 587:587 \
  -v /path/to/certs:/etc/ssl \
  --env-file .env \
  -e TLS_KEY_PATH=/etc/ssl/private/bridge.key \
  -e TLS_CERT_PATH=/etc/ssl/certs/bridge.crt \
  lumimail-bridge
```

### 3. Configure email clients

In your email client:

**IMAP:**
- Server: your bridge host
- Port: 993 (SSL) or 143 (STARTTLS)
- Username: your full email address (e.g. alice@example.com)
- Password: your Lumimail API key (Settings → API Keys)

**SMTP:**
- Server: your bridge host
- Port: 587 (STARTTLS)
- Username: your full email address
- Password: your Lumimail API key

### 4. Generate an API key

In Lumimail, go to **Settings → API Keys** and create a key with scopes `messages:read` and `send`.

## Supported commands

| Command | Status |
|---------|--------|
| LOGIN | ✅ |
| LIST / LSUB | ✅ |
| SELECT / EXAMINE | ✅ |
| FETCH (headers, body) | ✅ |
| STORE (\Seen, \Deleted) | ✅ |
| EXPUNGE | ✅ |
| STATUS | ✅ |
| SEARCH | ✅ (returns all) |
| NAMESPACE | ✅ |
| SMTP send | ✅ |

## Folder mapping

| IMAP folder | Lumimail |
|-------------|----------|
| INBOX | Inbox |
| Sent | Sent |
| Drafts | Drafts |
| Spam / Junk | Spam |
| Trash | Trash |
| Starred | Starred |
