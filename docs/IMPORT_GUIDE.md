# Import Guide – where each file goes and exactly how

Everything here was made for SPG staging. Do the sections you need, in any order.

| What | File(s) | Goes to |
|---|---|---|
| API test collection | `SPG_API_QA_Report_2026-10-07/postman/*.json`, `qa-photo.png` | Postman |
| Automation project | `spg-qa-automation/` (this repo) | Your Linux machine + Git |
| AI skills | `.opencode/skills/*/SKILL.md` | Opencode and/or Claude Code |
| Bug report pages | `SPG_API_QA_Report_2026-10-07/markdown/*.md` | Coda (team) or Outline |
| Bug tracker table | `SPG_API_QA_Report_2026-10-07/markdown/SPG_Bug_Tracker_2026-10-07.csv` | Coda table |
| Word reports | `SPG_API_QA_Report_2026-10-07/*.docx` | Attach in Coda / Outline / Zoom Docs |
| Data-driven test data | `test-data/support-staff-ddt.csv` | Postman Runner |
| "How everything works" guide | `docs/HOW_IT_WORKS.md` (+ `docs/SPG_QA_How_Everything_Works.pdf`) | Coda / Outline page (+ PDF attachment) |

---

## 1. Postman
1. Postman → **Import** → drop both files: `SPG_Admin_API_Verified_QA_Suite_v2.1.postman_collection.json` and `SPG_Staging_v2.postman_environment.json`. Copy `qa-photo.png` into your Postman working directory (Settings → General → Working directory; Linux default `~/Postman/files`) – otherwise the photo upload sends an empty file. The second collection `SPG_Admin_API_Creates_Permanent_Data_v2.1` creates records SPG cannot delete – import and run it only on purpose.
2. Top-right environment menu → choose **SPG Staging (v2)**.
3. Environments → SPG Staging (v2) → `adminPassword` → type the password in **Current value** only (Initial value is shared on export).
4. Settings ⚙ → General → **Working directory** → pick the `postman/` folder (it contains `qa-photo.png`, used by the upload request).
5. Collection ⋯ → **Run** → keep the folder order → Run. Folders 00–13, 97, 99 should be green; folder 98 is red until the bugs are fixed.
6. Data-driven run (optional): Runner → **Select File** → `test-data/support-staff-ddt.csv`.

> Don't log in to the CMS with the same account while Postman runs – one session per account ("Invalid Token!").

## 2. Automation project (Linux)
**Easiest:** from the package folder run `./run.sh setup`, then `./run.sh test` and `./run.sh postman`.

Or step by step:
```bash
cd spg-qa-automation
bash scripts/setup-linux.sh        # installs packages + Chromium – no sudo needed
nano .env                          # set SPG_ADMIN_PASSWORD
npm run test:smoke                 # quick check (5 scenarios)
npm test                           # everything (about 5 minutes)
npm run report                     # opens the HTML report
node scripts/sprint-report.mjs "Sprint 7"   # Markdown report for Coda/Outline
```
WSL2: same commands. If Chromium won't start, setup switches to the installed Google Chrome (`PW_CHANNEL=chrome` in `.env`).

**Put it in Git:** `git init && git add . && git commit -m "SPG QA automation"` then push to your team's repo. `.env`, reports and `.auth/` are already ignored.

## 3. AI skills
**Opencode (team standard in the QA guide)**
- Inside this repo: nothing to do – Opencode loads `.opencode/skills/` automatically.
- For all projects: `bash scripts/install-skills.sh opencode-global`
- Use: ask in plain words, e.g. *"Generate test cases for this story: …"*. Opencode picks the matching skill.

**Claude Code**
- `bash scripts/install-skills.sh claude` (already done on this machine). Undo: `bash scripts/install-skills.sh remove claude`.
- Use: plain words, or call by name: `/testcase-generator`, `/api-testcase-generator`, `/automation-generator`, `/bug-report-writer`, `/qa-docs-writer`.

> Install globally for only ONE tool – Opencode also reads `~/.claude/skills`, so installing for both would list each skill twice.

## 4. Coda (recommended – the team SRS lives here)
**Bug report pages**
1. In the SPG doc, add a page **"SPG Bugs – 7 Oct 2026"** (near the SRS).
2. Open `SPG_Confirmed_Bugs_Summary_2026-10-07.md` in a text editor → select all → copy.
3. Paste into the Coda page (Ctrl+V). Coda turns the Markdown into headings, tables and tick boxes. Keep the formatted version in the small menu that appears.
4. Add a sub-page and do the same with `SPG_Suspected_Bugs_Summary_2026-10-07.md`.

**Bug tracker table**
1. On a new sub-page type `/import` → **CSV** → upload `SPG_Bug_Tracker_2026-10-07.csv` → *First row has headers* → create a new table.
2. Change the **Status** column to a *Select list* (Open, In progress, Fixed, Verified, To verify) and add a **People** column called Owner.
3. Add views: group by *Severity / Confidence*, filter *Type = Confirmed*.

**Evidence:** drag the two `…_Detailed.docx` files onto the page as attachments.
**Security bugs** (SPG-BUG-01, 03, 19, 28): put them on a page shared only with your senior and developers.

## 5. Outline
- **One file:** open the collection → ⋯ menu → **Import** → choose the `.md` (or `.docx`) file. Dragging the file onto the collection also works.
- **Many files at once:** Settings → **Import** → Markdown (zip) – admin only.
- **Who can see it:** a shared collection = everyone with access to that collection; a private collection or draft = only you / invited people. Check the collection's **Permissions** before importing.

### Import the "How everything works" guide (Coda or Outline)
- **Coda:** new page "SPG QA – How it works" → open `docs/HOW_IT_WORKS.md`, copy all, paste. Drag `SPG_QA_How_Everything_Works.pdf` onto the page as the printable version.
- **Outline:** collection ⋯ → **Import** → `docs/HOW_IT_WORKS.md`. Attach the PDF by dragging it into the document.

## 6. Zoom Docs
- **In the app:** Docs → **More** → **Import** → **Import local files** → pick a `.md` or `.docx`. If Word import fails, use the Markdown file.
- **By API (developers):** `POST /v2/docs/import_content` with Markdown (≤ 100 KB) – needs a Zoom Marketplace OAuth app with Docs scopes (ask your Zoom admin).

## 7. Jira RTM
1. Test cases: keep the RTM folder per EPIC; paste each Gherkin scenario into the RTM test case (title in bold, steps, input, expected) – the `@TC-…` tag in the feature file is the RTM test case id.
2. Bugs: create them from the test case execution (QA guide rule) and link to the task. Use `bug-report-writer` for the text.
3. Test execution evidence: attach `reports/cucumber-report.html` (or the sprint report) to the RTM test execution.

## 8. CI pipeline (GitHub Actions)
1. Push the repo to GitHub.
2. Settings → Secrets and variables → Actions:
   - **Secrets:** `SPG_ADMIN_PASSWORD`, `SLACK_WEBHOOK_URL` (optional)
   - **Variables:** `SPG_API_URL`, `SPG_CMS_URL`, `SPG_ADMIN_EMAIL`, `SPG_AWS_REGION`, `SPG_COGNITO_POOL_ID`, `SPG_S3_BUCKET`
3. Pull requests run `@smoke`; the nightly run does `@regression`; reports are kept 30 days as artifacts.
   Using GitLab or Bitbucket instead? The same 4 commands work: `npm ci`, `npx playwright install --with-deps chromium`, `npx bddgen test`, `npx playwright test`.
