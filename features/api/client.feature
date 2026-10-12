@api @client
Feature: Client management
  As an entity admin
  I want client details to be saved and connected correctly
  So that operators have everything they need in an emergency

  Background:
    Given I am logged in as a super admin
    And an entity exists
    And the entity has a call security number

  @smoke @TC-CL-001
  Scenario: Add a client with all sections connected
    When I create a client for the entity
    Then the response status is 201
    And the client is linked to the entity, security number and emergency contact

  @regression @photo @TC-CL-002
  Scenario: Change client, partner and dependent photos
    Given a client exists for the entity
    And I have uploaded the photo "qa-photo.png"
    When I change the client, partner and dependent photos to the uploaded photo
    Then the response status is 200
    And all client photos are the uploaded photo

  @regression @TC-CL-003
  Scenario: Rename the entity's call security number
    When I rename the call security number to "QA Line Renamed"
    Then the response status is 200
    And the call security number is called "QA Line Renamed"

  @regression @TC-CL-004
  Scenario: Enable and disable a client
    Given a client exists for the entity
    When I switch the client status
    Then the client status is "enabled"
    When I switch the client status
    Then the client status is "disabled"

  @regression @TC-CL-005
  Scenario: See a client's alert history
    Given a client exists for the entity
    When I open the client's alert history
    Then the response status is 200
    And the response contains a list
