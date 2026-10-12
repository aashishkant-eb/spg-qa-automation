@ui @cms
Feature: CMS basics
  As a CMS user
  I want login, navigation and entity details to work
  So that I can manage SPG safely

  @smoke @TC-UI-003
  Scenario: Wrong password shows an error on the login page
    Given I open the CMS login page
    When I sign in with a wrong password
    Then I see the login error "Invalid username or password!"
    And I am still on the login page

  @smoke @TC-UI-004
  Scenario: Main menu is shown after signing in
    Given I am logged in as a super admin
    And I am signed in to the CMS
    Then the main menu shows these items:
      | Dashboard         |
      | Entity Management |
      | User Management   |
      | Global Alerts     |

  @regression @fail @SPG-BUG-02 @creates-data @TC-UI-005
  Scenario: Entity edit page shows the real principal admin
    Given I am logged in as a super admin
    And I am signed in to the CMS
    And an entity exists
    And an entity support staff user is added to the entity
    When I open the entity edit page
    Then the principal admin email shows the original principal admin
