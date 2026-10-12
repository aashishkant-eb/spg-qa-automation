# Example – `bug-report-writer` on SPG findings (EB Pearls format)

## Confirmed

### SPG-BUG-25 – Saved photo is not shown on Super Admin edit page after reopening
**Priority:** High   **Environment:** Stage   **RTM_Environment:** CMS
**Linked task / test case:** <Jira key> / TC-PH-002, TC-UI-002

**Description:** The photo uploads and saves, but the edit page never shows it again, so users think the update failed.

**Steps to replicate**
1. Log in to the CMS as Super Admin.
2. Open Super Admin → Edit on any record.
3. Click Upload, choose a PNG, Crop, then Update.
4. Reopen the same record.

**Expected result:** The saved photo is displayed (SRS – photos; common standard).
**Actual result:** Only Upload/Delete buttons are shown; no picture. The API returns the saved photo key.

**Device / OS / Browser:** Desktop · Linux · Chromium 1.63 (Playwright)   **Network:** Wi-Fi   **Build:** CMS 0.0.2
**Evidence:** `evidence/ui-screenshots/e2e-05-edit-page-reopened.png`; automated scenario TC-UI-002
**Reproduced:** 3/3 on 7 Oct 2026 · second method: Field Operative form shows the photo (control) → cause is the form, not upload.

### SPG-BUG-02 – Entity edit shows and updates the wrong person as Principal Admin
**Priority:** High   **Environment:** Stage   **RTM_Environment:** CMS / API
**Description:** After a support staff user is added to an entity, the entity page shows that user as Principal Admin. Saving the entity overwrites that user's details.
**Steps to replicate**
1. Create an entity. 2. Add an Entity Support Staff user. 3. Open Entity → Edit.
**Expected result:** Principal Admin Details show the original principal admin.
**Actual result:** They show the support staff user (email qa.es.…).
**Evidence:** `evidence/ui-screenshots/ui-03-entity-edit-wrong-principal-admin.png`; scenario TC-EN-003
**Reproduced:** 3/3 · second method: fresh entity with only one staff user added.

## Suspected

### SPG-SUS-02 – Photos may stop showing after about an hour on an open page
**Why we suspect it:** Image links are signed with temporary credentials (~1 h) though the code asks for 5.7 days.
**How to verify:** Copy a photo address, wait 65 minutes, open it.
**It IS a bug if:** the image no longer opens. **It is NOT a bug if:** it still opens.
