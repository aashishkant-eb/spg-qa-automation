# Example – `automation-generator` on TC-PH-002 "Saved photo is shown after reopening"

**Input:** the Gherkin from example 01. **Output:** already in this repo and verified.

| Piece | File |
|---|---|
| Scenario | `features/ui/photo-display.feature` (TC-UI-001 control, TC-UI-002 known bug `@fail @SPG-BUG-25`) |
| Steps reused | `I am logged in as a super admin` (common), `a super admin exists`, `an entity exists`, `a field operative exists for the entity` (setup) |
| New steps | `steps/ui/photo.steps.ts` – sign in with the API session, open edit page, upload + crop, save, reopen, photo shown |

## What the steps check (and why)
1. Upload waits for the **real S3 upload response**, then for the CMS upload spinner to disappear.
2. Save waits for **this record's PATCH** (the CMS also sends an unrelated PATCH on every page) and checks the request **contains the photo**.
3. "Photo is shown" first checks the **API stored it**, then that an `<img>` with that file is **rendered** – so a display bug can't be confused with a save bug.

## Verification output (7 Oct 2026)
```
✓ Photos are shown in the CMS › Field operative photo is shown after saving   @TC-UI-001
✓ Photos are shown in the CMS › Super admin photo is shown after saving       @fail @SPG-BUG-25 (failed as expected at "the saved photo is shown")
2 passed
```

## Lesson found while automating
Clicking **Update immediately after Crop** saved the form with an empty photo (HTTP 200, `profilePhoto: ""`). Logged as suspected **SPG-SUS-12** – needs a manual check with human timing.
