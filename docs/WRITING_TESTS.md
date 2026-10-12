# Writing tests – the short version

1. **Write the scenario** in `features/api/` (no browser) or `features/ui/` (browser). Plain business language – no URLs or code.
2. **Tag it:** `@smoke` or `@regression`, the RTM id `@TC-AREA-001`, an area tag (`@photo`, `@security`…). Not ready yet → `@wip`. Can't be automated → `@manual`.
3. **Known bug?** Put `@fail @SPG-BUG-xx` on the Scenario (or Examples) line. The run stays green while the bug exists and turns red when it's fixed – then remove `@fail`.
4. **Find existing steps:** `npm run steps:list`. Reuse wording when the meaning is the same.
5. **New step needed?** Add it in `steps/…` – or ask the `automation-generator` skill.
6. **Check:** `npx bddgen test` (missing steps?), `npm run check` (types), then run just yours: `TAGS='@TC-AREA-001' npm test`.

## Rules that keep the suite reliable
- Every record you create gets a `cleanup.add(...)` – names start with "QA", emails `qa.*@example.com`.
- PATCH requests send the full object (SPG rejects partial bodies).
- Wait for the network response that proves an action (upload, save) – never fixed sleeps.
- One worker only: SPG allows one session per account.
- Never automate actions that harm staging (emergency response comments – SPG-BUG-24).

## Handy commands
| Command | What it does |
|---|---|
| `npm test` | everything (except `@wip`, `@manual`) |
| `npm run test:smoke` / `test:regression` | by tag |
| `npm run test:api` / `test:ui` | by layer |
| `npm run test:known-bugs` | only `@fail` scenarios |
| `npm run test:headed` | watch the browser |
| `TAGS='@photo' npm test` | any tag expression (`@wip`, `@manual`, `@creates-data` stay excluded unless you name them, e.g. `TAGS='@TC-SS-001 and @creates-data'`) |
| `npm run report` | HTML report with screenshots, video, trace |
| `node scripts/sprint-report.mjs "Sprint 7"` | Markdown sprint report |
