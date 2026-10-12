# SPG QA Package – How Everything Works

> New to Gherkin or Postman? See the plain-English glossary: `docs/GLOSSARY.md`.

> Bug reports, the verified Postman collection, the Gherkin + Playwright automation for the API and CMS, and the AI QA skills – in plain language. SPG staging · 7 Oct 2026 · EB Pearls QA Process Guidelines.

---

## 1. 🧭 The big picture

**Requirement** (SRS in Coda / Jira story) → **Test cases** (RTM + Gherkin · *testcase-generator*) → **Automation** (features + steps · *automation-generator*) → **Run** (Playwright, API + CMS · `npm test` / CI) → **Results** (reports + bugs · *bug-report-writer*) → **Documents** (Coda / Outline · *qa-docs-writer*)

| Folder / file | What it is | Who uses it |
|---|---|---|
| `START_HERE.md` | One-page map of the package | Everyone |
| `SPG_API_QA_Report_…/` Word files | Confirmed bugs (short + detailed), suspected bugs and how to verify | Senior, EM, developers |
| `…/markdown/` | Same reports as Markdown + bug tracker CSV | Coda, Outline, Zoom Docs |
| `…/postman/` | Verified Postman collection v2.1 (115 requests, creates no permanent records) + “Creates Permanent Data” collection (39 requests, on purpose only) + environment + upload photo | Manual / API QA |
| `SPG_Jira_Bug_Reporting_2026-10-08/` | How to work in Jira (time log, bug tickets, linking to stories) + 10 bug tickets ready to paste + cleanup request for devs | Daily Jira work |
| `spg-qa-automation/` | Gherkin + Playwright project, CI, AI skills, guides | Automation QA |

> 🔒 Passwords are not included anywhere. Set them in Postman (*Current value*) and in `.env`.

---

## 2. 🧩 How SPG works – what a tester must know

| Topic | What to know |
|---|---|
| CMS and API | The CMS (stagecms) calls the SPG API (stageapi …/v1) for everything. |
| One session per account | A new login ends the previous one → **"Invalid Token!"**. The automation logs in once and shares the session. |
| Photos | The CMS uploads the picture to S3 (via Cognito) and saves only the file **key** in `profilePhoto` / `entityLogo`. |
| Entity context | Entity screens send `x-effective-role: entityPrincipalAdmin` ("Login on behalf"). |
| Updates | PATCH must send the whole record. Partial bodies are rejected – on "my profile" they **erase** fields (SPG-BUG-11). |
| Emergencies | Start = `POST /admin/emergency`. Mark as safe = `PATCH /admin/emergency/{id}` with `{}` – works. **Response comments crash staging** (SPG-BUG-24). |

---

## 3. ⚙️ The automation – how a test runs

`.feature` (plain English) → `bddgen` (turns it into Playwright tests) → **steps** (code behind each sentence) → **fixtures** (`api`, `world`, `cleanup`, `page`) → **reports** (HTML, Cucumber, JUnit, Markdown)

```gherkin
@ui @photo
Feature: Photos are shown in the CMS
  @regression @fail @SPG-BUG-25 @TC-UI-002
  Scenario: Super admin photo is shown after saving
    Given a super admin exists
    When I open the super admin edit page
    And I upload and crop the photo "qa-photo.png"
    And I save the form
    And I reopen the edit page
    Then the saved photo is shown
```

| Piece | Job |
|---|---|
| `api` | Calls the API with the shared session; logs in again if another login ended it |
| `world` | Remembers IDs and bodies between the steps of one scenario |
| `cleanup` | Deletes everything the scenario created, even when it fails |
| CMS sign-in | Puts the API token into the browser instead of typing the password |
| `redact()` | Removes passwords, hashes and tokens from failure messages and reports |

| Tag | Meaning |
|---|---|
| `@smoke` / `@regression` | Quick check on every change / full pack nightly and before release |
| `@wip` / `@manual` | Not ready / can't be automated – never run by default |
| `@TC-AREA-001` | RTM test case id |
| `@fail @SPG-BUG-xx` | Known bug – green while the bug exists, **red when fixed** → remove `@fail` |

**Coverage – 32 scenarios: 27 run by default + 5 tagged `@creates-data` (they add records SPG cannot delete – run on purpose only: `npm run test:creates-data`).** API: login & security, support staff, entities, clients, security numbers, lists & dropdowns, emergencies (start, safe, delete, archive). CMS: login error, main menu, entity principal admin, photo shown after saving.
**Every CMS endpoint accounted for:** 116 endpoints – 92 tested, 18 not run on purpose (they send real messages or change shared settings), 6 need data first. Details: `docs/API_COVERAGE.md`.
**Last verified** 8 Oct 2026 (27 default scenarios): 21 pass · 5 known bugs flagged · 1 unexpected failure – TC-EN-001 failed once on timing (SPG-SUS-13) and passed 3 of 3 re-runs. The run added 0 entities, field operatives, support staff or entity users.

---

## 4. 🐧 Run it on Linux – one command

From the package folder (where `run.sh` is):

```bash
./run.sh setup        # once: packages + Chromium
./run.sh smoke        # 5 quick scenarios
./run.sh test         # everything – API + CMS (~5 min) + sprint report
./run.sh postman      # Postman collection with newman (~2 min)
./run.sh postman-create  # "Creates Permanent Data" collection – asks you to type YES
./run.sh report       # open the HTML report
./run.sh skills       # install the AI skills for Claude Code / OpenClaude
```
The password is already in `spg-qa-automation/.env` in your private copy.

- [ ] CI: add `SPG_ADMIN_PASSWORD` as a GitHub secret; PRs run `@smoke`, nightly runs `@regression`, Slack gets the result.
- [ ] Postman: import collection + environment, set `adminPassword` *Current value*, working directory = `postman/`, run in order.

---

## 5. 🤖 AI skills – OpenClaude, Claude Code, Opencode

| Skill | Give it | You get |
|---|---|---|
| `testcase-generator` | Story / SRS / acceptance criteria | RTM table + Gherkin + coverage + open questions |
| `api-testcase-generator` | Endpoints / dev handoff | API cases, DDT CSV, Postman tests |
| `automation-generator` | Approved Gherkin | Feature + steps, verified by a real run |
| `bug-report-writer` | Failures, notes, screenshots | EB Pearls-format bugs, confirmed vs suspected |
| `qa-docs-writer` | Sprint data | Release report, test plan, automation report |

- **OpenClaude / Claude Code:** open `spg-qa-automation` – `.claude/skills` and `CLAUDE.md` load automatically. All projects: `bash scripts/install-skills.sh claude`.
- **Opencode:** `.opencode/skills` and `AGENTS.md` load automatically. All projects: `bash scripts/install-skills.sh opencode-global`.
- After editing a skill: `bash scripts/sync-skills.sh`, then commit.
- Install and connect the tools on Ubuntu: `docs/AI_TOOLS_SETUP.md`.

**AI rules:** AI drafts, people approve · verify with a real run · confirmed vs suspected · no secrets · nothing harmful on shared environments · security findings on restricted pages.

---

## 6. 📥 Importing the reports

| Where | How |
|---|---|
| **Coda** (SRS is here) | Copy the `.md`, paste into a page. Tracker: `/import` → CSV. Attach the detailed Word files. Security bugs on a restricted page. |
| **Outline** | Collection ⋯ → Import → `.md` or `.docx`. Shared collection = everyone with access; private = only you. |
| **Zoom Docs** | Docs → More → Import → Import local files. |
| **Jira RTM** | `@TC-…` tag = RTM id; bugs from test execution, linked to the task. |

Full steps: `docs/IMPORT_GUIDE.md`.

---

## 7. 🐞 Findings at a glance

| Bug | Severity | In one line |
|---|---|---|
| SPG-BUG-01 | 🔴 Critical | Password hashes and push tokens returned by the API |
| SPG-BUG-11 | 🔴 Critical | Partial "my profile" update erases the email – locked out |
| SPG-BUG-24 | 🔴 Critical | Emergency response comment crashes the API for 5–30 s |
| SPG-BUG-28 | 🔴 Critical | Photo storage listable/writable without login |
| SPG-BUG-25 | 🟠 High | Photos save but most CMS edit pages don't show them |
| SPG-BUG-02 | 🟠 High | Entity page shows/edits the wrong Principal Admin |

28 confirmed (4 Critical, 6 High, 10 Medium, 8 Low) · 14 suspected.

---

## 8. 📱 Mobile apps – next step

Same Gherkin, driven by **Appium (WebdriverIO + Cucumber)** on **LambdaTest real devices**; AI explores screens through **Appium MCP**; people approve test cases, code and every bug. Calls, push, GPS and camera keep a short manual check. Full plan: `docs/MOBILE_AUTOMATION_PLAN.md`.

## 9. 🛠️ Troubleshooting

| You see | Why | Do this |
|---|---|---|
| `./run.sh`: permission denied | Unzip dropped the executable flag | `bash run.sh …` or `chmod +x run.sh` |
| 401 "Invalid Token!" | Same account logged in elsewhere | Dedicated QA account; suite re-logs in |
| Chromium won't start | Missing Linux libraries (installing them needs admin rights) | Set `PW_CHANNEL=chrome` in `.env` to use the installed Google Chrome (setup does this automatically), or ask IT to run `npx playwright install-deps chromium` once |
| `bddgen`: missing step | No step code for a line | `npm run steps:list`, reuse or add |
| "Expected to fail, but passed" | Known bug looks fixed | Re-check, remove `@fail` |
| 502 everywhere | Staging restarted (often SPG-BUG-24) | Wait ~30 s |
| Photo saved as empty | Update clicked before upload finished (SPG-SUS-12) | Wait for the spinner |

## ✅ Sprint checklist (QA guide)
- [ ] Planning: test cases for the next two sprints (RTM + Gherkin)
- [ ] Sprint: automate approved scenarios; `@wip` until deployed
- [ ] Every merge: CI `@smoke` – a failing pipeline blocks the merge
- [ ] Regression sprint: `npm run test:regression` + Postman
- [ ] Release: sprint automation report + release report; bugs linked in Jira
- [ ] Retro: known bugs that turned green, timing results
