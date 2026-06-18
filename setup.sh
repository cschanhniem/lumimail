#!/usr/bin/env bash
# Lumimail bootstrap — get from clone to a running dev server.
# Idempotent: safe to re-run. See README.md → Setup and CONTRIBUTING.md.
set -euo pipefail

cd "$(dirname "$0")"

bold() { printf '\033[1m%s\033[0m\n' "$1"; }
info() { printf '  \033[36m›\033[0m %s\n' "$1"; }
warn() { printf '  \033[33m!\033[0m %s\n' "$1"; }

bold "Lumimail setup"

# 1. Node version check (CI uses Node 22).
if command -v node >/dev/null 2>&1; then
  NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
  if [ "$NODE_MAJOR" -lt 22 ]; then
    warn "Node $(node -v) detected; this project targets Node >=22 (CI uses 22)."
  else
    info "Node $(node -v)"
  fi
else
  warn "Node is not installed. Install Node >=22 first: https://nodejs.org"
  exit 1
fi

# 2. Local secrets file.
if [ ! -f .dev.vars ]; then
  cp .dev.vars.example .dev.vars
  warn "Created .dev.vars from the example — edit it and add your CF_TOKEN before deploying."
  warn "See README.md → Required secrets for the exact Cloudflare token scopes."
else
  info ".dev.vars already present"
fi

# 3. Dependencies.
info "Installing dependencies (npm ci if lockfile is clean, else npm install)…"
if [ -f package-lock.json ]; then
  npm ci || npm install
else
  npm install
fi

# 4. Local D1 database migrations.
info "Applying local D1 migrations…"
npm run db:migrate:local

bold "Done."
echo
echo "  Next steps:"
echo "    npm run dev        # http://localhost:3000  (register at /register)"
echo "    npm run verify     # typecheck + lint + 100%-coverage tests (definition of done)"
echo
echo "  Read AGENTS.md and docs/ARCHITECTURE.md to orient. Pick a task from docs/AGENT_TASKS.md."
