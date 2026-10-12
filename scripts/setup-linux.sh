#!/usr/bin/env bash
# One-time setup on Linux / WSL2. Needs NO sudo: everything installs inside your home folder with npm.
# Usage: bash scripts/setup-linux.sh
set -euo pipefail
cd "$(dirname "$0")/.."

need_node_major=18
if ! command -v node >/dev/null; then
  echo "Node.js is not installed. Install it without sudo using nvm (installs into ~/.nvm):"
  echo "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash"
  echo "  source ~/.bashrc && nvm install 22"
  echo "Then run this script again."
  exit 1
fi
major=$(node -p 'process.versions.node.split(".")[0]')
if [ "$major" -lt "$need_node_major" ]; then echo "Node $major found; need $need_node_major+ (nvm install 22)."; exit 1; fi

# `npm install -g` must not need sudo: point the global folder at your home if it is a system folder.
prefix=$(npm config get prefix)
if [ ! -w "$prefix" ]; then
  npm config set prefix "$HOME/.npm-global"
  echo "== npm global packages now go to ~/.npm-global (no sudo). Add to ~/.bashrc:"
  echo '   export PATH="$HOME/.npm-global/bin:$PATH"'
fi

echo "== Installing npm packages"
npm ci 2>/dev/null || npm install

echo "== Downloading Chromium for Playwright (into ~/.cache/ms-playwright, no sudo)"
npx playwright install chromium

if [ ! -f .env ]; then
  cp .env.example .env
  chmod 600 .env
  echo "== Created .env – open it and set SPG_ADMIN_PASSWORD"
fi

echo "== Checking the browser starts"
if node -e "require('@playwright/test').chromium.launch().then(b=>b.close())" 2>/tmp/spg-chromium-check.log; then
  echo "Chromium OK"
elif node -e "require('@playwright/test').chromium.launch({channel:'chrome'}).then(b=>b.close())" 2>/dev/null; then
  echo "Bundled Chromium can't start (missing Linux libraries, needs sudo) – but Google Chrome works."
  grep -q '^PW_CHANNEL=' .env && sed -i 's/^PW_CHANNEL=.*/PW_CHANNEL=chrome/' .env || echo 'PW_CHANNEL=chrome' >> .env
  echo "Set PW_CHANNEL=chrome in .env – UI tests will use Google Chrome."
else
  echo "WARNING: no browser could start. API tests and Postman still work."
  echo "For UI tests ask IT to run once:  npx playwright install-deps chromium   (needs admin)"
  echo "Details: /tmp/spg-chromium-check.log"
fi

echo "== Checking the setup (no network calls)"
npx bddgen test && npx playwright test --list | tail -1
if grep -q "^SPG_ADMIN_PASSWORD=." .env; then
  echo "Done. .env is ready – next: npm run test:smoke (or ./run.sh smoke from the package folder)"
else
  echo "Done. Next: put the password in .env (SPG_ADMIN_PASSWORD=...), then run: npm run test:smoke"
fi
