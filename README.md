# SPG QA Automation

[![CI](https://github.com/ebpearls/spg-qa-automation/actions/workflows/qa-automation.yml/badge.svg)](https://github.com/ebpearls/spg-qa-automation/actions/workflows/qa-automation.yml)
[![Playwright](https://img.shields.io/badge/Playwright-1.63+-green.svg)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-UNLICENSED-red.svg)](LICENSE)

Automated QA suite for **SPG** (CMS: https://stagecms.red.global, API: https://stageapi.red.global/v1) built with **Gherkin + Playwright (playwright-bdd)**, following the **EB Pearls QA Process Guidelines**.

## 📋 Overview

| Aspect | Details |
|--------|---------|
| **Framework** | Playwright + playwright-bdd (Cucumber/BDD) |
| **Language** | TypeScript |
| **Test Types** | API (no browser) + UI (browser) |
| **Tagging** | `@smoke`, `@regression`, `@wip`, `@creates-data`, `@fail @SPG-BUG-xx` |
| **CI/CD** | GitHub Actions (smoke on PR/push, regression nightly) |
| **Reporting** | HTML reports + Slack notifications + Sprint summary |
| **AI Skills** | 5 EB Pearls QA skills (Opencode / Claude Code) |

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- npm 10+
- Access to SPG staging environment

### Installation

```bash
# Clone the repository
git clone https://github.com/ebpearls/spg-qa-automation.git
cd spg-qa-automation

# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps chromium

# Configure environment
cp .env.example .env
# Edit .env with your credentials (SPG_ADMIN_PASSWORD, etc.)

# Generate step definitions from Gherkin
npm run gen

# Run smoke tests
npm run test:smoke

# Run full regression
npm run test:regression
```

### Using the Run Script (Linux)
```bash
./run.sh setup    # One-time setup
./run.sh test     # Run tests
./run.sh postman  # Run Postman collection
./run.sh report   # Generate sprint report
```

## 📁 Project Structure

```
spg-qa-automation/
├── .github/workflows/     # CI/CD pipelines
├── docs/                  # Documentation (PDF, MD, guides)
├── features/              # Gherkin scenarios
│   ├── api/              # API-only tests (no browser)
│   └── ui/               # UI tests (browser required)
├── steps/                 # Step definitions
│   └── fixtures.ts       # API client, world, cleanup
├── support/               # API client, photo upload, test data
├── test-data/             # Test photos, DDT CSV files
├── scripts/               # Setup, reporting, Slack, utilities
├── templates/             # Gherkin templates
├── .opencode/skills/      # AI QA skills (Opencode)
├── .claude/skills/        # AI QA skills (Claude Code)
├── .auth/                 # Auth state (gitignored)
├── reports/               # Test reports (gitignored)
├── playwright.config.ts   # Playwright configuration
├── tsconfig.json          # TypeScript configuration
├── package.json
├── AGENTS.md              # AI agent instructions
├── CLAUDE.md              # Claude Code instructions
└── README.md
```

## 🏷️ Test Tags & Conventions

| Tag | Purpose | CI Trigger |
|-----|---------|------------|
| `@smoke` | Critical path tests | PR, push, manual |
| `@regression` | Full regression suite | Nightly (Mon-Fri 06:30 AEST) |
| `@wip` | Work in progress | Excluded from CI |
| `@creates-data` | Tests that create entities | Manual only |
| `@fail @SPG-BUG-xx` | Known bugs (expected to fail) | Tracked separately |

## ⚙️ Configuration

### Environment Variables (`.env`)

```bash
# Required
SPG_API_URL=https://stageapi.red.global/v1
SPG_CMS_URL=https://stagecms.red.global
SPG_ADMIN_EMAIL=your-admin@email.com
SPG_ADMIN_PASSWORD=your-password

# AWS (for photo uploads)
SPG_AWS_REGION=ap-southeast-2
SPG_COGNITO_POOL_ID=ap-southeast-2_xxx
SPG_S3_BUCKET=spg-staging-uploads

# Optional: Slack notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
```

### Playwright Projects

- **api** - API tests (Chromium, headless, no UI)
- **ui** - UI tests (Chromium, headless/headed)

## 🧪 Running Tests

```bash
# Generate steps from Gherkin (run after editing features)
npm run gen

# Type checking
npm run check

# Smoke tests (fast, critical paths)
npm run test:smoke

# Full regression
npm run test:regression

# API only
npm run test:api

# UI only
npm run test:ui

# Known bugs (expected failures)
npm run test:known-bugs

# Headed mode (debug UI)
npm run test:headed

# Debug mode
npm run test:debug

# UI mode (interactive)
npm run test:ui-mode

# Tests that create data (manual cleanup)
npm run test:creates-data
```

## 📊 Reports & Artifacts

| Command | Output |
|---------|--------|
| `npm run report` | Playwright HTML report |
| `npm run report:summary` | Sprint automation report (Markdown) |
| CI artifacts | `qa-reports-<run_number>` (30-day retention) |

Reports include:
- Pass/fail status with screenshots/videos on failure
- Timing metrics
- Known bug tracking
- Sprint summary for stakeholders

## 🤖 AI QA Skills

This repo includes 5 EB Pearls QA skills for AI-assisted testing:

| Skill | Purpose |
|-------|---------|
| `testcase-generator` | Generate test cases from SRS/Jira/AC |
| `api-testcase-generator` | Generate API test cases + DDT CSV + Postman |
| `automation-generator` | Convert Gherkin → Playwright automation |
| `bug-report-writer` | Write standard EB Pearls bug reports |
| `qa-docs-writer` | Generate QA documents (release report, test plan, etc.) |

See `AGENTS.md` / `CLAUDE.md` for usage rules.

## 🐛 Known Bugs

Scenarios tagged `@fail @SPG-BUG-xx` are **confirmed bugs** in the SPG platform:
- When a bug is fixed, the scenario turns **red** (unexpected pass)
- Remove `@fail` to convert it to a normal regression test
- Never log emergency responses on staging (SPG-BUG-24)
- Never send partial PATCH to `/admin/auth/me/update` (SPG-BUG-11)

## 📚 Documentation

- [How Everything Works](docs/HOW_IT_WORKS.md) / [PDF](docs/SPG_QA_How_Everything_Works.pdf)
- [Import Guide](docs/IMPORT_GUIDE.md)
- [AI Tools Setup](docs/AI_TOOLS_SETUP.md)
- [Glossary](docs/GLOSSARY.md)
- [API Coverage](docs/API_COVERAGE.md)
- [AI Workflow](docs/AI_WORKFLOW.md)
- [Writing Tests](docs/WRITING_TESTS.md)
- [Mobile Automation Plan](docs/MOBILE_AUTOMATION_PLAN.md)

## 🔒 Security & Best Practices

- **Never commit secrets** - Use `.env` (gitignored) and GitHub Secrets
- **One session per account** - CI uses `concurrency: spg-staging`
- **Automatic cleanup** - Every created entity gets `cleanup.add(...)`
- **Test data naming** - Prefix with `QA`, emails use `qa.*@example.com`
- **Redact secrets in logs** - Use `redact()` from `support/redact.ts`

## 🤝 Contributing

1. Create feature branch from `develop`
2. Write Gherkin scenarios in `features/`
3. Run `npm run gen` to generate steps
4. Implement step definitions in `steps/`
5. Run `npm run check` for type checking
6. Run relevant test suite (`npm run test:smoke` / `npm run test:regression`)
7. Open PR - CI runs smoke tests automatically

## 📄 License

UNLICENSED - Private EB Pearls project

## 👥 Team

- **QA Lead**: EB Pearls QA Team
- **Framework**: Playwright + playwright-bdd
- **Process**: EB Pearls QA Process Guidelines

---

*Last updated: October 2026*