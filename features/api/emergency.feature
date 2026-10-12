@api @emergency
Feature: Emergencies
  As an operator
  I want to start an emergency and mark it safe
  So that clients get help and the case is closed properly

  # Do NOT add "post a response comment" here: it crashes staging (SPG-BUG-24).

  Background:
    Given I am logged in as a super admin
    And an entity exists
    And the entity has a call security number
    And a client exists for the entity

  @regression @slow @TC-EM-001
  Scenario: Start an emergency and mark it as safe
    When I start an emergency for the client
    Then the emergency is active
    When I mark the emergency as safe
    Then the response status is 200
    And the emergency is closed

  @regression @performance @SPG-BUG-21 @TC-EM-002
  Scenario: Starting an emergency is timed against the SRS limit (SRS 5.1)
    When I start an emergency for the client
    Then the response time is recorded against the 3000 ms SRS limit

  @regression @slow @TC-EM-003
  Scenario: Delete a closed emergency and remove it from the archive
    When I start an emergency for the client
    And I mark the emergency as safe
    And I delete the emergency
    Then the response status is 200
    When I delete the emergency from the archive
    Then the response status is 200
    And the emergency no longer exists
