---
name: testcase-generator
description: Generate functional test cases from an SRS section, Jira user story or acceptance criteria, in EB Pearls RTM table format and as Gherkin (BDD) scenarios ready for automation. Use when asked to "generate test cases", "write test cases", "make scenarios" or "cover this story".
license: MIT
compatibility: opencode
metadata:
  audience: qa-engineers
  workflow: test-design
---

# Test Case Generator

## What I do
Turn requirements (SRS text, Jira story, acceptance criteria, Figma notes) into:
1. **RTM test cases** – the table QA pastes into Jira RTM.
2. **Gherkin scenarios** – the same cases as `.feature` text, ready for the `automation-generator` skill.

## When to use me
- Sprint preparation: test cases for the next two sprints (QA guide: written before sprint kick-off).
- A story or RFC changed and its test cases need updating.
- Reviewing an SRS for missing edge cases (list the gaps as questions for the BA).

## Instructions
1. Read the requirement fully. List every acceptance criterion as a numbered item. If something is unclear or missing (limits, roles, error text, time zone), add it to **Open questions** – never invent the answer.
2. Identify the EPIC and feature. Test case IDs: `TC-<EPIC-SHORT>-<NNN>` (e.g. `TC-AUTH-001`). Folder = EPIC (RTM guideline), not sprint.
3. For each criterion write at least one positive case, then apply the **Coverage Rules** below.
4. Mark dependencies: if a feature changes data shown elsewhere (e.g. profile name → listing), add a "Relates to / Has to be done before" note.
5. Write each case in plain language: one action per step, observable expected result, real test data (realistic names, AU phone numbers `+61 4xx xxx xxx`, real image files).
6. Produce the Gherkin version: one `Feature` per feature, `Background` for shared setup, `Scenario Outline` + `Examples` for data-driven cases. Business language only – no selectors, URLs or code.
7. Tag every scenario: `@smoke` (core happy path, ≤ 10% of cases), `@regression` (everything else), `@TC-…` id, plus area tags (`@api`, `@ui`, `@photo`, `@security`). Add `@wip` for scenarios waiting on development, `@manual` for ones that can’t be automated.
8. End with a short coverage summary.

## Trigger Rules
- "generate test cases", "write test cases", "test scenarios for", "Gherkin for", "BDD for", "cover this story".
- Input contains an SRS section, user story ("As a … I want …") or acceptance criteria.
- Do NOT trigger for API endpoint lists → use `api-testcase-generator`.

## Output Rules
- Plain, simple English. A new QA must understand every case without asking.
- Never mark a case as covering a criterion it doesn't verify.
- Expected results must be checkable (exact message, state, value) – not "works correctly".
- Keep Gherkin steps reusable: same wording for the same action across features (check existing steps with `npx bddgen export` when working inside the automation repo).

## Output Format
### 1. Open questions (if any)
Numbered list for the BA/EM.

### 2. RTM test cases
| ID | Title (what is tested) | Preconditions | SRS link | Steps | Input / test data | Expected result | Priority | Type |
|---|---|---|---|---|---|---|---|---|

Priority uses the EB Pearls scale: Highest, High, Medium, Low, Lowest. Type: Positive / Negative / Edge / Security / UI.

### 3. Gherkin
```gherkin
@<area>
Feature: <feature name>
  As a <role>
  I want <goal>
  So that <value>

  Background:
    Given <shared setup>

  @smoke @TC-XXX-001
  Scenario: <plain-language title>
    Given …
    When …
    Then …
```

### 4. Coverage summary
| Acceptance criterion | Test cases | Covered? |
|---|---|---|

## Coverage Rules
Always consider (include those that apply, say which don't):
- **Positive** happy path for each role allowed to use the feature.
- **Negative**: missing required fields, invalid formats (email, phone), duplicates, wrong role / no permission, expired session.
- **Boundaries**: min/max length (SPG text fields require ≥ 3 chars), max file size (5 MB per QA guide), empty lists, page 1 / last page / out-of-range page.
- **Files & photos**: allowed types only (JPEG/PNG), reject scripts and SVG, > 5 MB rejected, the saved photo is **shown again after reopening** (not only "saved").
- **Data integrity**: updating one field must not change or erase others; the right record is edited; list, detail and dashboard counts agree.
- **Security basics** (QA guide checklist): user only sees own/allowed data, token expiry sends user to login, no secrets in responses or URLs, XSS input escaped.
- **Dependencies**: features that read the changed data.
- **Australia specifics**: AU phone format, time zones (AEST/AEDT), date format DD/MM/YYYY.
- **State & concurrency**: double-click submit, two admins editing the same record, network drop mid-save.
- **Mobile apps** (when the story is for iOS/Android): permissions allowed/denied (camera, location, notifications), app in background and resumed, network lost mid-action, small and large screens, OS versions in scope (QA guide: Android 10+, iOS 15+), tag `@mobile @android/@ios`; mark calls, push and GPS walk tests `@manual`.

## Jira rule (all skills)
Jira is **read-only** for AI. You may *read* Jira (stories, subtasks, existing bugs – e.g. to find the story a bug relates to or to avoid duplicates). You must **never** create, edit, comment on, link, transition or log time in Jira. Prepare the text; the QA engineer pastes it into Jira themselves.
