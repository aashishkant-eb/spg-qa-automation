# AI-assisted QA workflow (follows the QA guide's "QA Skills Setup")

## The flow
```
Jira story / SRS (Coda)
   │  testcase-generator      → RTM test cases + Gherkin            (QA reviews, QA Lead approves)
   │  api-testcase-generator  → API cases + DDT CSV + Postman tests
   ▼
features/*.feature  (tags: @smoke @regression @wip @TC-…)
   │  automation-generator    → step definitions in steps/, verified with bddgen + a run
   ▼
CI: smoke on every PR, regression nightly → reports/ + Slack
   │  bug-report-writer       → Jira bugs (EB Pearls format), confirmed vs suspected
   │  qa-docs-writer          → sprint automation report, release report, test plan (Coda / Outline)
   ▼
Sign-off
```

## Day-to-day prompts (Opencode or Claude Code, inside this repo)
| When | Say |
|---|---|
| Sprint planning | "Generate test cases for this story: <paste story + acceptance criteria>" |
| API ticket handed over | "Generate API test cases for POST /admin/support-staff: <paste dev handoff comment>" |
| Cases approved | "Automate features/api/<file>.feature – reuse existing steps" |
| After a run | "Write bug reports from reports/sprint-automation-report.md" |
| End of sprint | "Write the Sprint 7 release report for my senior – short" |

## AI guidelines (rules for the team)
1. **AI drafts, people approve.** Test cases go through QA Lead review (RTM guideline); bugs are reproduced by a QA before logging.
2. **Verify, don't trust.** Every generated script must pass `npx bddgen test`, `npm run check` and one real run before merge. Every API "fact" is checked against a real response or the frontend code.
3. **Confirmed vs suspected.** Never log a suspicion as a bug. Use the suspected format with "how to verify".
4. **No secrets in prompts or output.** Use `.env` and `{{variables}}`; redact tokens, passwords, hashes, push tokens.
5. **Do no harm to shared environments.** AI must not run destructive or crash-prone actions (e.g. SPG emergency response comments) – mark them `@manual`.
6. **Security findings stay high-level** and go to restricted pages.
7. **Keep skills current.** When a lesson is learned (new rule, new pitfall), update the matching `SKILL.md` in this repo – the change reaches everyone through Git.

## Mobile apps
Same flow for the SPG apps with Appium (WebdriverIO + Cucumber), LambdaTest devices and Appium MCP for AI exploration – see [MOBILE_AUTOMATION_PLAN.md](MOBILE_AUTOMATION_PLAN.md).

## Ideas to take it further
- **Jira → AI trigger (QA guide future vision):** n8n (already used for the Coda QA documents workflow) listens for "story ready for QA" and runs `testcase-generator`, posting the result to Coda for review.
- **Coda QA documents:** feed `reports/sprint-automation-report.md` into the Coda QA Documents template via the same n8n flow.
- **Playwright MCP** for AI-driven exploratory testing sessions that save their findings as Gherkin drafts.
- **Self-healing hints:** `playwright-bdd` has an `aiFix` option that attaches a fix prompt to failed steps – useful when selectors change.
- **Ask the frontend team for `data-testid`** on upload buttons and form fields (QA guide: stable selectors) – makes UI tests faster and sturdier.
- **More layers:** visual comparison of key screens (`toHaveScreenshot`), Locust/JMeter load tests for the 3-second SRS limit, OWASP ZAP baseline scan in CI.
