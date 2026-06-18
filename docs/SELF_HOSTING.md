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

- Account: Workers Scripts: Edit
- Account: Email Sending: Edit
- Zone: Zone: Read
- Zone: DNS: Edit
- Zone: Email Routing Rules: Edit

Store the token as a secret. Do not commit it.

```bash
npx wrangler secret put CF_TOKEN
