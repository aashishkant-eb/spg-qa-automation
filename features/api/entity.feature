@api @entity
Feature: Entity management
  As a super admin
  I want to manage entities and their admins
  So that each organisation is set up correctly

  Background:
    Given I am logged in as a super admin
    And an entity exists

  @regression @photo @TC-EN-001
  Scenario: Change the entity logo and principal admin photo
    Given I have uploaded the photo "qa-photo.png"
    When I change the entity logo and principal admin photo to the uploaded photo
    Then the response status is 200
    And the entity logo and principal admin photo are the uploaded photo

  @regression @TC-EN-002
  Scenario: Disable and enable an entity
    When I switch the entity status
    Then the entity is inactive
    When I switch the entity status
    Then the entity is active

  @regression @fail @SPG-BUG-02 @creates-data @TC-EN-003
  Scenario: The principal admin stays the same after adding support staff
    When an entity support staff user is added to the entity
    Then the entity principal admin is still the original principal admin

  @regression @fail @SPG-BUG-23 @creates-data @TC-EN-004
  Scenario: Delete an entity support staff user from the CMS
    Given an entity support staff user is added to the entity
    When I delete that user the way the CMS does
    Then the response status is 200
