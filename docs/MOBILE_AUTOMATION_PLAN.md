# Mobile app automation with AI – plan (SPG)

> **Goal:** the same Gherkin test cases that drive the CMS and API also drive the SPG mobile apps (client app – "lite"/"secure", field operative app), with AI doing the repetitive work and people approving the important steps.
> **Status:** plan. Nothing here has been run yet – it needs the app builds (APK / IPA) and device access.

## 1. Recommended stack
| Need | Tool | Why |
|---|---|---|
| Test language | **Gherkin** (same as web) | QA guide: test cases in Gherkin in RTM; one language for web, API and mobile |
| Mobile driver | **Appium 2** with **WebdriverIO + Cucumber** | Listed in the QA guide; runs Gherkin natively; Android + iOS; works with LambdaTest |
| Quick smoke flows (optional) | **Maestro** (YAML) | Very fast to write, auto-waits; good for a 5-minute build-acceptance check |
| Devices | **LambdaTest real-device cloud** (already in the QA guide) + 1–2 physical phones | Real devices for releases; emulators only for quick feedback |
| AI control of devices | **Appium MCP** (official) or **Maestro MCP** | Lets OpenClaude/Claude Code/Opencode see the screen, tap, type and suggest locators |
| API setup/cleanup | **This repo's API client** | Create the client/entity through the API, test the phone flow, clean up through the API |

## 2. How the AI and people work together
| Step | AI does | Person does (checkpoint) |
|---|---|---|
| 1. Test design | `testcase-generator` writes RTM cases + Gherkin from the story | **QA Lead approves** the cases (QA guide review) |
| 2. Explore the app | Through Appium MCP: opens screens, lists elements, suggests stable locators | QA watches, **corrects wrong assumptions** |
| 3. Write automation | `automation-generator` writes WebdriverIO step code reusing shared Gherkin steps | **Code review** in a pull request |
| 4. Run | CI runs `@smoke` on every build from App Center/TestFlight, `@regression` nightly on LambdaTest | – |
| 5. Triage failures | Reads logs/screenshots/video, says *bug* vs *flaky test* vs *changed screen*, drafts the bug with `bug-report-writer` | **QA confirms** before it goes to Jira |
| 6. Fix tests | Proposes a locator/step fix for changed screens | **QA accepts or rejects** (no silent self-healing) |
| 7. Report | `qa-docs-writer` builds the sprint automation report | QA Lead signs off |

## 3. What stays partly manual (and how to keep it small)
| Area | Why it is hard | Way through |
|---|---|---|
| OTP / email verification | Real codes go to phones/inboxes | Use the stage **bypass OTP** (QA guide: 123456) or a test inbox API |
| Emergency call (audio/video) | Real media, Chime meetings | Automate *start* and *mark safe* via API + app screens; check call quality **by hand** on a physical device each release |
| Push notifications | Delivered by the OS | Assert the API sent it + check on 1 physical device per release |
| Location / "Follow me" | GPS | Mock location on emulator/cloud device; manual walk test before go-live |
| Camera / photo upload | Device camera | Inject images from the gallery (Appium push file); camera itself manual |
| Payments (if any) | Real money | Stripe/PayPal test cards in sandbox only |
| App-store builds | Signing, review | Manual release checklist (QA guide go-live checklist) |

## 4. Rules that keep mobile automation reliable
1. **Ask developers for test IDs** (`testID` in React Native / `accessibilityIdentifier` in iOS / `resource-id` in Android) on every button and field – the QA guide lists this under "Frontend Devs: stable selectors".
2. **Set up data through the API**, not the phone (faster and stable) – this repo's `api` fixture already does it.
3. **One session per account** applies to the apps too: give each device its own test account.
4. **Tags:** `@mobile @android @ios @smoke @regression @manual` so the same feature file can run per platform.
5. **Never automate actions that crash shared environments** (SPG-BUG-24).

## 5. Rollout (6 sprints)
| Sprint | Deliverable |
|---|---|
| 1 | Get APK/IPA from App Center/TestFlight; WebdriverIO + Appium + Cucumber skeleton in this repo (new folder `features/mobile/` – to create); 1 login scenario on an emulator |
| 2 | LambdaTest real devices; CI job on every new build; Appium MCP set up for AI exploration |
| 3 | Smoke pack: login, start emergency, mark safe, profile photo (5–8 scenarios) |
| 4 | Regression pack for client app; `@manual` list for calls/push/location |
| 5 | Field operative app flows; mobile `automation-generator` examples |
| 6 | Sprint automation report covers web + API + mobile; retro on flaky tests |

## 6. Example – one scenario, three layers
```gherkin
@mobile @android @smoke @TC-MOB-001
Scenario: Client can start an emergency from the app
  Given a client exists for the entity            # API (this repo)
  And the client is signed in on the mobile app   # Appium
  When the client presses the emergency button    # Appium
  Then the emergency is active                    # API check (this repo)
  And the operator sees it in the CMS             # Playwright (this repo)
```

## 7. Ideas beyond test scripts
- **Build-triggered runs:** App Center/TestFlight webhook → CI → smoke on 2 real devices → Slack.
- **AI exploratory sessions:** once a sprint, an AI agent explores new screens through Appium MCP and lists anything odd as *suspected* bugs for a QA to check.
- **Visual checks:** screenshot comparison of key screens per device size.
- **Accessibility:** automated contrast/label checks on each screen (Appium + axe-style rules).
- **Performance:** app start time and emergency-start time recorded each run (like SPG-BUG-21 for the API).
