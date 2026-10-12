---
name: automation-generator
description: Convert Gherkin scenarios into working Playwright + Cucumber (playwright-bdd) automation in the spg-qa-automation repo - feature files, step definitions, fixtures and tags - then generate and verify them. Use when asked to "automate this", "write step definitions" or "convert Gherkin to Playwright".
license: MIT
compatibility: opencode
metadata:
  audience: automation-qa
  workflow: test-automation
---

# Automation Script Generator (Gherkin → Playwright/Cucumber)

## What I do
Take Gherkin scenarios (from RTM or `testcase-generator`) and add them to this repo so they run with `npm test`: `.feature` files in `features/`, step definitions in `steps/`, reusing what already exists.

## When to use me
- New sprint scenarios are ready to automate (QA guide: create skeleton scripts early, finalise after development).
- A manual regression case should become automated.
- A bug was found – add a regression scenario tagged `@fail @SPG-BUG-xx` until it is fixed.

## Instructions
1. **Read the repo first**: `playwright.config.ts`, `steps/fixtures.ts`, and run `npx bddgen export` to list existing steps. Reuse a step if the wording matches in meaning – adjust the scenario wording rather than duplicating a step.
2. Put the feature in `features/api/` (no browser) or `features/ui/` (browser). One feature per business feature, `Background` for shared setup.
3. Steps go in `steps/api/<area>.steps.ts`, `steps/ui/<area>.steps.ts`, or `steps/setup.steps.ts` for "Given … exists" data setup used by both.
4. Step code rules:
   - Import `Given/When/Then` from `../fixtures` (or `./fixtures`).
   - Use fixtures: `api` (SPG API client), `world` (data shared between steps of one scenario), `cleanup` (register a delete for EVERY record you create), `page` (UI).
   - Store the last API result in `world.last` so common steps (`the response status is {int}`) work.
   - PATCH requests send the full object (`world.bodies.<thing>`), never a partial body.
   - UI: prefer `getByRole`, `getByLabel`, `data-testid`; wait for the network response that proves the action (upload, save) – never `waitForTimeout`.
   - No hard-coded passwords, tokens or IDs; config comes from `.env` via `support/env.ts`.
5. Tags: `@smoke` / `@regression` / `@wip` (QA guide), `@TC-…` RTM id, area tags, and for known bugs `@fail @SPG-BUG-xx` **on the Scenario or Examples line** (not the Feature – `@fail` is not inherited).
6. Verify before finishing:
   ```bash
   npx bddgen test            # fails if any step is missing
   npm run check              # TypeScript
   npx playwright test --list # scenario appears
   TAGS='@TC-XXX-001' npm test   # run just the new scenario
   ```
7. Report: files changed, new steps, the command output, and anything not verified.

## Trigger Rules
- "automate", "step definitions", "Playwright", "Cucumber", "playwright-bdd", "convert Gherkin", a `.feature` file in the input.

## Output Rules
- Working code only – run the verify commands; if they fail, fix or say exactly what fails.
- One session per account: keep `workers: 1`; UI tests reuse the API session (token in localStorage) instead of the login form.
- Never automate actions that harm the shared environment (e.g. SPG "post emergency response comment" crashes staging – SPG-BUG-24). Add them as `@manual` with a comment.
- Clean data: every created record has a cleanup; names start with "QA", emails `qa.*@example.com`.

## Output Format
1. Summary (2–3 lines).
2. Files: path + full content for new files, diff for changed files.
3. Verification output (copied from the terminal).
4. How to run: the exact `npm` / `TAGS=` command.

## Coverage Rules
- Every RTM case tagged `@TC-…` maps to exactly one scenario (or one Examples row).
- Each scenario checks the outcome the user cares about (e.g. photo is **shown**, not only saved) and the data in the API.
- Negative cases use `Scenario Outline` + `Examples` (data-driven).
- Known bugs stay automated with `@fail` so the run goes red when the bug is fixed and the tag must be removed.

## Jira rule (all skills)
Jira is **read-only** for AI. You may *read* Jira (stories, subtasks, existing bugs – e.g. to find the story a bug relates to or to avoid duplicates). You must **never** create, edit, comment on, link, transition or log time in Jira. Prepare the text; the QA engineer pastes it into Jira themselves.
