@ui @photo
Feature: Photos are shown in the CMS
  As a CMS user
  I want to see the photo I saved
  So that I know the update worked

  Background:
    Given I am logged in as a super admin
    And I am signed in to the CMS

  @regression @TC-UI-001
  Scenario: Field operative photo is shown after saving
    Given an entity exists
    And a field operative exists for the entity
    When I open the field operative edit page
    And I upload and crop the photo "qa-photo.png"
    And I save the form
    And I reopen the edit page
    Then the saved photo is shown

  @regression @fail @SPG-BUG-25 @TC-UI-002
  Scenario: Super admin photo is shown after saving
    Given a super admin exists
    When I open the super admin edit page
    And I upload and crop the photo "qa-photo.png"
    And I save the form
    And I reopen the edit page
    Then the saved photo is shown
