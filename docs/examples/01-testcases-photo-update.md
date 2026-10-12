# Example – `testcase-generator` on SPG "Profile photo update"

**Input:** SRS – "Admins can upload, crop, change and delete a profile photo / logo (JPEG/PNG) on every user and entity form."

## 1. Open questions
1. Maximum file size? (QA guide default: 5 MB – not stated in SRS.)
2. Should the old photo file be deleted from storage when replaced?
3. Which forms show a preview after saving? (Today only Client and Field Operative do – see SPG-BUG-25.)

## 2. RTM test cases
| ID | Title | Preconditions | SRS link | Steps | Input / test data | Expected result | Priority | Type |
|---|---|---|---|---|---|---|---|---|
| TC-PH-001 | **Upload and save a photo on Support Staff edit** | Logged in as Super Admin; support staff exists | SRS 3.x Photos | 1. Open Support Staff → Edit 2. Upload → pick file 3. Crop 4. Update | qa-photo.png (64×64 PNG) | Success message; photo saved | High | Positive |
| TC-PH-002 | **Saved photo is shown after reopening** | TC-PH-001 done | SRS 3.x | 1. Reopen the same record | – | The uploaded photo is displayed | High | Positive |
| TC-PH-003 | **Only JPEG/PNG accepted** | Edit form open | SRS 3.x | 1. Upload a .svg / .pdf | logo.svg, doc.pdf | "JPEG, JPG, and PNG only accepted!"; nothing saved | High | Negative |
| TC-PH-004 | **Files over 5 MB rejected** | Edit form open | QA guide – File Upload | 1. Upload a 6 MB JPEG | big.jpg (6 MB) | Clear size error; nothing saved | Medium | Boundary |
| TC-PH-005 | **Replacing a photo keeps other fields** | Record with photo | SRS 3.x | 1. Upload new photo 2. Update 3. Reopen | new.png | Only the photo changed; name, email, title unchanged | High | Data integrity |
| TC-PH-006 | **Delete photo** | Record with photo | SRS 3.x | 1. Delete 2. Update 3. Reopen | – | No photo; placeholder initial shown | Medium | Positive |
| TC-PH-007 | **Upload failure is reported** | Network to storage blocked | QA guide – Error handling | 1. Upload 2. Crop | qa-photo.png | Error message; old photo kept | Medium | Negative |
| TC-PH-008 | **Entity edit updates the real principal admin** | Entity with support staff added | SRS 3.x | 1. Edit entity 2. Change principal admin photo 3. Update | qa-photo.png | Photo saved on the principal admin, not another user | High | Data integrity |

## 3. Gherkin
```gherkin
@ui @photo
Feature: Photos are shown in the CMS
  As a CMS user
  I want to see the photo I saved
  So that I know the update worked

  Background:
    Given I am logged in as a super admin
    And I am signed in to the CMS

  @regression @fail @SPG-BUG-25 @TC-PH-002
  Scenario: Super admin photo is shown after saving
    Given a super admin exists
    When I open the super admin edit page
    And I upload and crop the photo "qa-photo.png"
    And I save the form
    And I reopen the edit page
    Then the saved photo is shown
```

## 4. Coverage summary
| Acceptance criterion | Test cases | Covered? |
|---|---|---|
| Upload, crop, save | TC-PH-001 | ✅ |
| Photo visible after save | TC-PH-002 | ✅ (automated – UI) |
| Allowed types / size | TC-PH-003, 004 | ✅ manual |
| Change / delete | TC-PH-005, 006 | ✅ |
| Correct record updated | TC-PH-008 | ✅ (automated – API, SPG-BUG-02) |
