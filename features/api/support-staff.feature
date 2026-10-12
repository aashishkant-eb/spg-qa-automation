@api @support-staff
Feature: Support staff management
  As a super admin
  I want to add and update SPG support staff
  So that the right people can help clients

  Background:
    Given I am logged in as a super admin

  @regression @creates-data @TC-SS-001
  Scenario: Add a support staff user
    When I create a support staff user
    Then the response status is 201
    And the new support staff user is in the support staff list

  @regression @photo @TC-SS-002
  Scenario: Change a support staff user's photo
    Given a support staff user exists
    And I have uploaded the photo "qa-photo.png"
    When I change the support staff user's photo to the uploaded photo
    Then the response status is 200
    And the support staff user's saved photo is the uploaded photo

  @regression @validation @TC-SS-003
  Scenario Outline: Reject invalid support staff details – <case>
    When I create a support staff user with "<field>" set to "<value>"
    Then the response status is 422
    And no support staff user with that name is saved

    Examples:
      | case             | field    | value |
      | missing name     | fullName |       |
      | duplicate email  | email    | DUPLICATE |

    @fail @SPG-BUG-06 @creates-data
    Examples: Known bug – invalid email is saved
      | case          | field | value        |
      | invalid email | email | not-an-email |

  @regression @validation @fail @SPG-BUG-08 @TC-SS-004
  Scenario: Empty phone number says it is required
    When I create a support staff user with "contactNumber" set to ""
    Then the response status is 422
    And the response message mentions "required"

  @regression @fail @SPG-BUG-04 @TC-SS-005
  Scenario: Page 2 of the support staff list shows different people
    When I open page 1 and page 2 of the support staff list
    Then the two pages show different people
