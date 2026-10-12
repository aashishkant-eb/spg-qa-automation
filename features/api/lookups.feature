@api @lookups
Feature: Lists and dropdowns used by the CMS
  As a CMS user
  I want every list and dropdown to load
  So that I can pick clients, groups, staff and pages

  Background:
    Given I am logged in as a super admin

  @smoke @regression @TC-LK-001
  Scenario: Lists used across the CMS load
    Then these lists load:
      | name                         | path                                                      | context |
      | Alert groups                 | /admin/alert-group                                        | admin   |
      | Global alert – clients       | /admin/client/globalAlert/getAllUserLists?searchQuery=&limit=20  | admin   |
      | Global alert – groups        | /admin/client/globalAlert/getAllGroupLists?searchQuery=&limit=20 | admin   |
      | User report                  | /admin/user/report/user-report                            | admin   |
      | Static pages                 | /admin/static-pages                                       | admin   |

  @regression @TC-LK-002
  Scenario: Entity dropdowns load for an entity
    Given an entity exists
    Then these lists load:
      | name                         | path                                                                  | context |
      | Clients for alert groups     | /admin/client/dropdown/min/alertGroup?searchQuery=&entityId={entity}  | entity  |
      | Field operatives             | /admin/user/field-operative/dropdown/min?searchQuery=&entityId={entity} | entity |
      | Support staff                | /admin/auth/support/dropdown/min?searchQuery=&entityId={entity}       | entity  |

  @regression @TC-LK-003
  Scenario: A static page opens by its id
    When I open the first static page
    Then the response status is 200
    And the page has a title and content
