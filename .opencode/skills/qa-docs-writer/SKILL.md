---
name: qa-docs-writer
description: Write EB Pearls QA documents - sprint release report, test plan, sprint automation report, defect analysis - in short plain language, formatted for import into Coda, Outline or Zoom Docs. Use when asked for a "release report", "test plan", "sprint report", "QA document" or "summary for my senior".
license: MIT
compatibility: opencode
metadata:
  audience: qa-engineers
  workflow: qa-documentation
---

# QA Docs Writer

## What I do
Produce the QA deliverables named in the EB Pearls QA guide (Test Plan, Release Report, Test Execution summary, Automation Report, Defect Analysis) as clean Markdown that imports well into Coda (team SRS/test plans), Outline, or Zoom Docs.

## When to use me
- End of sprint: release report + automation report.
- Project start: test plan from the SRS.
- A senior/EM/client needs a short summary.

## Instructions
1. Ask for (or find) the inputs: project + sprint name, environments and links, scope, test execution numbers, automation report (`reports/sprint-automation-report.md`), known bugs with Jira links, pending queries.
2. Pick the template:
   - **Release report** – Introduction, Sprint release history, Build details (platform/link/environment), Credentials (placeholders only), In scope, Test execution report table, Delivery checklist link, Known bugs & limitations, Pending queries, Next steps, Conclusion (sign-off yes/no with reason).
   - **Test plan** – Purpose, Project description, Scope (in / not in scope), Testing types table (type, description, phase, deliverables, owner, prerequisite), Strategy (STLC), Entry/Exit criteria, Environments, Browsers, Tools, Roles, Risks, Approval.
   - **Automation report** – totals, new failures, known bugs still open / fixed, coverage by feature, limitations.
   - **Defect analysis** – defects by priority, by assignee, root causes, actions for next sprint.
3. Write the short version first (1–2 pages: summary bullets, one table, next steps), then a detailed appendix only if asked.
4. Use the formatting rules below so it imports cleanly.

## Trigger Rules
- "release report", "release notes", "test plan", "sprint report", "automation report", "defect analysis", "QA document", "make it short for my senior".

## Output Rules
- Plain language; short sentences; explain any technical word once.
- Never include real passwords, tokens or personal data – placeholders like `{{registered email}}`.
- Numbers must come from the inputs – if missing, write "TBD" and list it under Pending queries.
- Sign-off: say clearly "Signed off" or "Not signed off – because …".

## Output Format
Markdown that imports well everywhere:
- `#` title once, `##` sections, `###` sub-sections; no deeper.
- Simple pipe tables (no merged cells, no line breaks inside cells).
- Severity markers 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low; tick boxes `- [ ]` for next steps.
- `>` quote for the one-line summary and warnings.
- Images as separate files referenced by name (upload them after import).
- Keep each document under ~100 KB (Zoom Docs Markdown import limit).

## Coverage Rules
- Every known Highest/High bug appears in the report with its Jira link.
- Every environment in scope is listed with its link.
- Test execution table covers every platform: total, executed, pass, fail, blocked, in progress.
- Next steps name an owner (QA / Dev / EM / Client).

## Jira rule (all skills)
Jira is **read-only** for AI. You may *read* Jira (stories, subtasks, existing bugs – e.g. to find the story a bug relates to or to avoid duplicates). You must **never** create, edit, comment on, link, transition or log time in Jira. Prepare the text; the QA engineer pastes it into Jira themselves.
