---
name: api-testcase-generator
description: Generate API test cases (request validation, response validation, error handling, data-driven cases) for REST or GraphQL endpoints, plus a DDT CSV and Postman test scripts. Use when given endpoints, a Swagger/GraphQL schema, a Postman collection or "test this API".
license: MIT
compatibility: opencode
metadata:
  audience: qa-engineers
  workflow: api-testing
---

# API Test Case Generator

## What I do
From endpoint details I produce API test cases, a data-driven (DDT) CSV, and ready-to-paste Postman test scripts – following the QA guide's API Testing Process (collection in the QA workspace, environments, DDT, collection runner).

## When to use me
- A developer hands off an API ticket (endpoint, method, headers, request/response schema – required by the QA guide's handoff comment).
- Building or fixing a Postman collection.
- Turning an API into Gherkin `@api` scenarios for the automation repo.

## Instructions
1. List each endpoint: method, path, auth, required headers (e.g. `x-effective-role`), request body, success response.
2. **Verify, don't assume.** If you can call the API (or read the frontend code that calls it), confirm the real method and body. SPG lesson: the CMS calls "resend invite" and "enable/disable entity" with GET, and PATCH endpoints need the FULL object – documentation and old collections were wrong.
3. For each endpoint write cases using the **Coverage Rules**.
4. Build a DDT CSV: one row per data set, columns = input fields + `expectedStatus` + `expectedMessage`.
5. Write Postman tests (pm.test) for each case: status, response time, schema fields, business rule, no secrets.
6. Offer the Gherkin form for the automation repo (`Scenario Outline` with `Examples` = the DDT rows).
7. List anything you could not verify as **Assumptions to confirm**.

## Trigger Rules
- "API test cases", "test this endpoint", "Postman tests", "DDT", "data-driven", Swagger/GraphQL/Postman content in the input.
- Not for UI-only stories → `testcase-generator`.

## Output Rules
- Expected status codes must be specific: 200/201 success, 401 no/invalid token, 403 not allowed, 404 not found, 422 validation. Flag any 400/500 for a validation problem as a bug.
- Never put real passwords or tokens in output – use `{{adminPassword}}`, `{{token}}` variables.
- Each test asserts ONE behaviour with a readable name.
- Mark destructive cases (delete, payments, notifications, anything that can take an environment down) with ⚠️ and say where they may run.

## Output Format
### 1. Endpoint summary
| Method | Path | Auth | Purpose |
|---|---|---|---|

### 2. Test cases
| ID | Endpoint | Case | Data | Expected status | Expected result | Type |
|---|---|---|---|---|---|---|

### 3. DDT CSV
```csv
case,field,value,expectedStatus,expectedMessage
```

### 4. Postman tests
```javascript
pm.test('Status is 201', () => pm.response.to.have.status(201));
pm.test('Response time < 3 s (SRS)', () => pm.expect(pm.response.responseTime).to.be.below(3000));
pm.test('No password hash in response', () => pm.expect(pm.response.text()).to.not.match(/"password":"\$2[aby]\$/));
```

### 5. Assumptions to confirm

## Coverage Rules
- **Auth**: no token → 401; garbage token → 401; expired token; wrong role → 403; one user can't read another user's or entity's data.
- **Validation**: each required field missing; wrong type; too short/long; invalid email/phone; unknown enum value (must be 422 with a friendly message, never raw DB errors).
- **Business rules**: duplicates rejected; created record readable by GET; list contains it; update changes only the sent fields; delete removes it from list and detail (repeat delete → 404).
- **Response hygiene**: consistent `{status, message, data}` envelope; no `password`, `pushToken`, third-party secrets; update responses return the NEW data.
- **Pagination**: page 2 differs from page 1; out-of-range page → 200 with empty list; totals match.
- **Files**: type and 5 MB limits enforced server-side, not only in the UI.
- **Performance**: response < 3 s (SRS 5.1) for normal calls.
- **Sessions**: note if a new login invalidates old tokens (SPG does) – tests must share one session or run serially.

## Jira rule (all skills)
Jira is **read-only** for AI. You may *read* Jira (stories, subtasks, existing bugs – e.g. to find the story a bug relates to or to avoid duplicates). You must **never** create, edit, comment on, link, transition or log time in Jira. Prepare the text; the QA engineer pastes it into Jira themselves.
