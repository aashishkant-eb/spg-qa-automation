# SPG – 7 Oct 2026 (final verification) – Automation Report

**Date:** 2026-10-07 · **Environment:** staging · **Scenarios:** 32

| 🟢 Passed | 🔴 Failed | 🟠 Known bugs open | 🟢 Known bugs fixed? | ⚪ Skipped |
|---|---|---|---|---|
| 23 | 0 | 9 | 0 | 0 |

## ✅ No new failures

## All scenarios

| Feature | Scenario | Test case | Bug | Result |
|---|---|---|---|---|
| Login and session | Super admin can log in and see their profile | TC-AUTH-001 |  | 🟢 Passed |
| Login and session | Protected data needs a login | TC-AUTH-002 |  | 🟢 Passed |
| Login and session | Wrong password and unknown email give the same message | TC-AUTH-003 |  | 🟢 Passed |
| Login and session | Dashboard counts need a login | TC-AUTH-004 | SPG-BUG-05 | 🟠 Known bug – still open |
| Login and session | User lists never contain password hashes | TC-AUTH-005 | SPG-BUG-01 | 🟠 Known bug – still open |
| Client management | Add a client with all sections connected | TC-CL-001 |  | 🟢 Passed |
| Client management | Change client, partner and dependent photos | TC-CL-002 |  | 🟢 Passed |
| Client management | Rename the entity's call security number | TC-CL-003 |  | 🟢 Passed |
| Client management | Enable and disable a client | TC-CL-004 |  | 🟢 Passed |
| Client management | See a client's alert history | TC-CL-005 |  | 🟢 Passed |
| Emergencies | Start an emergency and mark it as safe | TC-EM-001 |  | 🟢 Passed |
| Emergencies | Starting an emergency is timed against the SRS limit (SRS 5.1) | TC-EM-002 | SPG-BUG-21 | 🟢 Passed |
| Emergencies | Delete a closed emergency and remove it from the archive | TC-EM-003 |  | 🟢 Passed |
| Entity management | Change the entity logo and principal admin photo | TC-EN-001 |  | 🟢 Passed |
| Entity management | Disable and enable an entity | TC-EN-002 |  | 🟢 Passed |
| Entity management | The principal admin stays the same after adding support staff | TC-EN-003 | SPG-BUG-02 | 🟠 Known bug – still open |
| Entity management | Delete an entity support staff user from the CMS | TC-EN-004 | SPG-BUG-23 | 🟠 Known bug – still open |
| Lists and dropdowns used by the CMS | Lists used across the CMS load | TC-LK-001 |  | 🟢 Passed |
| Lists and dropdowns used by the CMS | Entity dropdowns load for an entity | TC-LK-002 |  | 🟢 Passed |
| Lists and dropdowns used by the CMS | A static page opens by its id | TC-LK-003 |  | 🟢 Passed |
| Support staff management | Add a support staff user | TC-SS-001 |  | 🟢 Passed |
| Support staff management | Change a support staff user's photo | TC-SS-002 |  | 🟢 Passed |
| Support staff management | Reject invalid support staff details – missing name | TC-SS-003 |  | 🟢 Passed |
| Support staff management | Reject invalid support staff details – duplicate email | TC-SS-003 |  | 🟢 Passed |
| Support staff management | Reject invalid support staff details – invalid email | TC-SS-003 | SPG-BUG-06 | 🟠 Known bug – still open |
| Support staff management | Empty phone number says it is required | TC-SS-004 | SPG-BUG-08 | 🟠 Known bug – still open |
| Support staff management | Page 2 of the support staff list shows different people | TC-SS-005 | SPG-BUG-04 | 🟠 Known bug – still open |
| CMS basics | Wrong password shows an error on the login page | TC-UI-003 |  | 🟢 Passed |
| CMS basics | Main menu is shown after signing in | TC-UI-004 |  | 🟢 Passed |
| CMS basics | Entity edit page shows the real principal admin | TC-UI-005 | SPG-BUG-02 | 🟠 Known bug – still open |
| Photos are shown in the CMS | Field operative photo is shown after saving | TC-UI-001 |  | 🟢 Passed |
| Photos are shown in the CMS | Super admin photo is shown after saving | TC-UI-002 | SPG-BUG-25 | 🟠 Known bug – still open |

> Full report with screenshots and traces: `npm run report` (reports/playwright-html) and reports/cucumber-report.html.
