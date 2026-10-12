# Glossary – the words used in this package

| Word | Meaning in plain English |
|---|---|
| **Gherkin** | The plain-English way we write tests: `Given` (the starting situation), `When` (what the user does), `Then` (what should happen). |
| **Feature** | One `.feature` file = one part of SPG (e.g. "Client management"). |
| **Scenario** | One test inside a feature, with a title anyone can read. |
| **Scenario Outline / Examples** | The same test run with several rows of data (data-driven testing). |
| **Background** | Steps that run before every scenario in that feature (e.g. "I am logged in as a super admin"). |
| **Step** | One line of a scenario. Each step has code behind it in `steps/`. |
| **Tag** | A label starting with `@`, used to pick which tests run. |
| `@smoke` | Quick, most important checks – run on every change. |
| `@regression` | The full set – run nightly and before a release. |
| `@wip` / `@manual` | Not ready yet / must be tested by a person. Never run automatically. |
| `@TC-…` | The test-case id in Jira RTM. |
| `@fail @SPG-BUG-xx` | **Known bug.** The test is expected to fail. If it suddenly passes, the bug was fixed – remove `@fail`. |
| **Logged in (API)** | The test logs in to the SPG API once and shares that session. |
| **Signed in to the CMS** | The browser tests reuse the same session instead of typing the password (a second login would log the first one out). |
| **Entity context** | Acting "on behalf of" an entity, like the CMS "Login on behalf" – the request carries `x-effective-role`. |
| **S3 key** | The file name of an uploaded photo in cloud storage. The API stores this key, not the picture. |
| **Postman collection** | A saved list of API requests with checks, run in Postman or with **newman** (Postman on the command line). |
| **Environment (Postman)** | The settings a collection uses: server address, email, password. |
| **Flaky test** | A test that sometimes passes and sometimes fails without any change. We remove or fix these. |
| **Cleanup** | After each test, the records it created are deleted (QA entities are disabled – SPG cannot delete them). |
| **Sprint automation report** | The short Markdown summary made after a run, ready to paste into Coda or Outline. |
| **Skill** | A saved set of instructions that teaches the AI tool (Opencode, Claude Code, OpenClaude) one QA job. |
