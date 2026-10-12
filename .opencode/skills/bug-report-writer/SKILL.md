---
name: bug-report-writer
description: Write clear bug reports in the EB Pearls standard (title answering what/where/when, steps, expected, actual, environment, priority) from test results, API responses, screenshots or notes - separating confirmed bugs from suspected ones. Use when asked to "write a bug", "log this defect", "make a bug report" or summarise failures.
license: MIT
compatibility: opencode
metadata:
  audience: qa-engineers
  workflow: defect-management
---

# Bug Report Writer

## What I do
Turn raw findings (failed tests, API responses, screenshots, chat notes) into bug reports a developer can fix and a manager can understand – in the EB Pearls RTM bug format, ready for Jira, Coda or Outline.

## When to use me
- After a test run or exploratory session with failures.
- Turning automation failures (`reports/sprint-automation-report.md`) into Jira bugs.
- Preparing a bug summary for a senior / EM / client.

## Instructions
1. **Reproduce first.** For each finding: can it be repeated? With what exact request/steps? If it happened only once or the cause is unclear, it is **Suspected**, not Confirmed.
2. Try a second, different check where possible (another endpoint, another screen, fresh data). Write down what you saw both times.
3. Write the title to answer **What? Where? Under what condition?** – e.g. "Saved photo is not shown on Super Admin edit page after reopening".
4. Fill every field of the Output Format. Use plain language; put technical detail (request/response) under Evidence.
5. Set priority with the EB Pearls scale (below). Security leaks of passwords/personal data, data loss and outages are Highest/High.
6. Link the bug to its task / test case (RTM: bugs come from test case execution, never left unlinked).
7. Redact secrets: passwords, tokens, AWS keys, push tokens; truncate password hashes.
8. Group: Confirmed bugs first (by priority), then Suspected (with how to verify), then "Checked – not a bug".

## Trigger Rules
- "bug report", "log a bug", "defect", "write this up", "what failed", failed test output in the input.

## Output Rules
- One bug = one problem. Split combined issues.
- Never call something confirmed without reproduction evidence; never weaken a real failure.
- Expected result must cite the source (SRS section, acceptance criterion, QA guide rule, or common standard).
- Short sentences, no jargon in Title/Description; jargon only in Evidence.

## Output Format
```markdown
### <ID> – <Title: what, where, under what condition>
**Priority:** Highest | High | Medium | Low | Lowest   **Environment:** Stage | UAT | Live   **RTM_Environment:** Web | CMS | iOS | Android | API
**Linked task / test case:** <Jira key> / <TC id>

**Description:** 1–2 plain sentences: what is wrong and who is affected.

**Steps to replicate**
1. …

**Expected result:** … (source: …)
**Actual result:** …

**Device / OS / Browser:** …   **Network:** Wi-Fi | 4G | …   **Build / version:** …
**Evidence:** request + response (redacted), screenshot, video or report link
**Reproduced:** 3/3 times on <date> · second method: <how>
```
Priority scale (EB Pearls RTM guideline):
- **Highest** – entire functionality blocked, no testing can proceed.
- **High** – impacts the typical user flow or blocks app usage.
- **Medium** – hurts user experience / functional issue not as expected.
- **Low** – minor problem with easy workaround, small enhancement.
- **Lowest** – trivial (typos, missing icons, layout).

For Suspected items replace Steps/Actual with: **Why we suspect it**, **How to verify**, **It IS a bug if / It is NOT a bug if**.

## Coverage Rules
- Include all failures from the input – list skipped ones with the reason.
- For each bug state impact on users and on data (data loss / wrong record / exposed data).
- Security findings: describe the risk and fix at a high level; do not write exploit steps; recommend restricted visibility (not a public page).

## Jira rule (all skills)
Jira is **read-only** for AI. You may *read* Jira (stories, subtasks, existing bugs – e.g. to find the story a bug relates to or to avoid duplicates). You must **never** create, edit, comment on, link, transition or log time in Jira. Prepare the text; the QA engineer pastes it into Jira themselves.
