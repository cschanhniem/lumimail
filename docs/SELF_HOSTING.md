# Self Hosting Guide

## Prerequisites

- Cloudflare account
- Domain added to Cloudflare
- Node.js installed
- Wrangler installed
- Access to DNS and Email Routing settings

## Install Wrangler

```bash
npm install -g wrangler
wrangler --version
```
## Cloudflare API Token

Create a Cloudflare API token with these permissions:

- Account: Email Sending: Edit
- Zone: Zone: Read
- Zone: DNS: Edit
- Zone: Email Routing Rules: Edit

Store the token safely. Do not commit it.

Keep this token handy; you will save it as a secret after Wrangler has been authenticated and configured.

## Wrangler Configuration

Authenticate Wrangler:

```bash
wrangler login
wrangler whoami
```

Typical settings include:

- account_id
- worker name
- routes
- environment variables

Verify configuration:

```bash
wrangler deploy --dry-run
```
## DNS Setup

1. Open Cloudflare Dashboard.
2. Select your domain.
3. Open DNS settings.
4. Create or verify the required DNS records.
5. Wait for DNS propagation.
   
## Email Routing Setup

1. Open Email Routing in Cloudflare.
2. Enable Email Routing.
3. Add destination email addresses.
4. Create routing rules.
5. Verify email delivery.

## Deploy

```bash
npm install
npm run deploy
```

## Verify Deployment

Check:

- Worker deployed successfully
- DNS records are active
- Email Routing is enabled
- Inbound email is routed correctly

## Troubleshooting

### 403 Invalid Token

Cause:
- Invalid or expired token

Fix:
- Generate a new token
- Verify token permissions

### 403 Missing Permissions

Cause:
- Missing DNS or Email Routing permissions

Fix:
- Add required permissions to the Cloudflare token

### Wrangler Authentication Errors
Fix:
- Run `wrangler login`
- Verify the correct Cloudflare account is being used

```bash
wrangler whoami
```

## Security Notes

Never commit:

- Cloudflare API tokens
- .env files
- .dev.vars files
- Private credentials
