@api @auth
Feature: Login and session
  As an SPG admin
  I want a secure login
  So that only signed-in admins can see platform data

  @smoke @TC-AUTH-001
  Scenario: Super admin can log in and see their profile
    Given I am logged in as a super admin
    When I open my profile
    Then the response status is 200
    And my profile shows the super admin role

  @regression @security @TC-AUTH-002
  Scenario: Protected data needs a login
    When I list super admins without logging in
    Then the response status is 401

  @regression @security @TC-AUTH-003
  Scenario: Wrong password and unknown email give the same message
    When I log in with a wrong password
    Then the response status is 401
    And the response message is "Invalid username or password!"
    When I log in with an unknown email
    Then the response status is 401
    And the response message is "Invalid username or password!"

  @regression @security @fail @SPG-BUG-05 @TC-AUTH-004
  Scenario: Dashboard counts need a login
    When I open the dashboard counts without logging in
    Then the response status is 401

  @regression @security @fail @SPG-BUG-01 @TC-AUTH-005
  Scenario: User lists never contain password hashes
    Given I am logged in as a super admin
    When I list support staff
    Then the response does not contain password hashes
