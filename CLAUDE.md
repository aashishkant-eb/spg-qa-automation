# Project rules for AI assistants (Opencode, Claude Code, OpenClaude)

This repo automates QA for **SPG** (CMS https://stagecms.red.global, API https://stageapi.red.global/v1) with **Gherkin + Playwright (playwright-bdd)**, following the EB Pearls QA Process Guidelines.

## Use the QA skills
`testcase-generator` → `api-testcase-generator` → `automation-generator` → `bug-report-writer` → `qa-docs-writer` (in `.opencode/skills/`, copied to `.claude/skills/`).

## Hard rules
1. **One session per account.** Keep `workers: 1`. UI tests reuse the API token (localStorage `serviceToken`); never log in through the form with valid credentials inside tests.
2. **Never post emergency response comments** (`POST /admin/emergency/response/:id`) on staging – it crashes the API (SPG-BUG-24).
3. **Never send partial PATCH bodies to real accounts** – `/admin/auth/me/update` erases fields (SPG-BUG-11). Tests send full objects.
4. Every record a test creates gets `cleanup.add(...)`; names start with "QA", emails `qa.*@example.com`.
5. Known bugs: `@fail @SPG-BUG-xx` on the Scenario/Examples line. Timing checks are recorded, not `@fail` (they flip run to run).
6. Never print secrets: use `redact()` from `support/redact.ts` in assertion messages; passwords only in `.env`.
7. Verify before claiming done: `npx bddgen test` → `npm run check` → run the scenario (`TAGS='@TC-…' npm test`).

8. **Jira is read-only.** Read stories, subtasks and existing bugs if useful; never create, edit, comment, link, transition or log time in Jira. Prepare ready-to-paste text instead – the QA engineer submits it.

## Map
`features/` Gherkin · `steps/` step definitions (`fixtures.ts`: `api`, `world`, `cleanup`) · `support/` API client, photo upload, test data · `scripts/` setup, report, Slack, skills · `docs/` guides.
