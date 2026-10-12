# API coverage – every endpoint the CMS uses

> Checked 7 Oct 2026 on SPG staging. The list comes from the CMS code itself (every API call it makes), so nothing the CMS uses is missing from this table.

| ✅ Tested | ⛔ Not run on purpose | ⏳ Needs data first | ❓ Not covered |
|---|---|---|---|
| 92 | 18 | 6 | 0 |

**How to read it**
- **✅ Tested** – called and checked on every run (Postman collection and/or the automation in this repo).
- **⛔ Not run on purpose** – running it would send real messages, change shared settings or the shared account, or crash staging. Test these by hand in an agreed window, or on a separate test environment.
- **⏳ Needs data first** – works only with data that does not exist on staging yet (chat history, follow-me links, predefined messages).

| Method | Endpoint | Status | How / why | CMS screen |
|---|---|---|---|---|
| GET | `/admin/admins` | ✅ Tested | Postman + Automation | EntityAdminsList |
| POST | `/admin/admins` | ✅ Tested | Postman + Automation | EntityAdminAddEdit |
| DELETE | `/admin/admins/delete/{id}` | ✅ Tested | Postman + Automation | EntityAdminsList |
| DELETE | `/admin/admins/{id}` | ✅ Tested | Postman + Automation | EntityAdminsList |
| GET | `/admin/admins/{id}` | ✅ Tested | Postman | AddEntityAdmin |
| PATCH | `/admin/admins/{id}` | ✅ Tested | Postman | EntityAdminAddEdit |
| GET | `/admin/alert-group` | ✅ Tested | Automation | AlertGroupsForm |
| POST | `/admin/alert-group` | ✅ Tested | Postman | AlertGroupAddEdit |
| GET | `/admin/alert-group/alert-list` | ✅ Tested | Postman | AlertGroupsList, AlertgroupForm |
| GET | `/admin/alert-group/dropdown` | ✅ Tested | Postman | ClientAlertGroup, groupSelectSearch |
| DELETE | `/admin/alert-group/{id}` | ✅ Tested | Postman | AlertGroupsList |
| GET | `/admin/alert-group/{id}` | ✅ Tested | Postman + Automation | AlertGroupAddEdit |
| PATCH | `/admin/alert-group/{id}` | ✅ Tested | Postman | AlertGroupAddEdit |
| GET | `/admin/alert/get-alert-sms/{id}` | ✅ Tested | Automation | index |
| GET | `/admin/alert/group` | ✅ Tested | Postman | index |
| GET | `/admin/alert/individual` | ✅ Tested | Postman | index |
| GET | `/admin/alert/predefined-messages` | ✅ Tested | Postman | PredefinedMessageList |
| GET | `/admin/alert/{id}` | ✅ Tested | Postman | chat |
| GET | `/admin/auth/count` | ✅ Tested | Postman + Automation | index |
| POST | `/admin/auth/forget-password` | ✅ Tested | Postman | JWTContext |
| POST | `/admin/auth/login` | ✅ Tested | Postman + Automation | JWTContext |
| GET | `/admin/auth/me` | ✅ Tested | Postman + Automation | JWTContext |
| GET | `/admin/auth/me/default-entity/fetch` | ✅ Tested | Postman | user |
| GET | `/admin/auth/roles` | ✅ Tested | Postman | JWTContext, useRoles |
| GET | `/admin/auth/roles/permissions/list` | ✅ Tested | Postman | Roles |
| GET | `/admin/auth/roles/{id}` | ✅ Tested | Postman | JWTContext, Roles |
| GET | `/admin/auth/support/dropdown/min` | ✅ Tested | Automation | AlertGroupSupportSelection |
| GET | `/admin/callSecurityNumberSettings` | ✅ Tested | Postman + Automation | ClientSecurityNumber, entitySettingsAddEdit |
| POST | `/admin/callSecurityNumberSettings` | ✅ Tested | Postman + Automation | index |
| PATCH | `/admin/callSecurityNumberSettings/{id}` | ✅ Tested | Automation | index |
| GET | `/admin/client` | ✅ Tested | Postman + Automation | index |
| POST | `/admin/client` | ✅ Tested | Postman + Automation | ClientAddEdit |
| DELETE | `/admin/client/delete/{id}` | ✅ Tested | Postman + Automation | index |
| GET | `/admin/client/dropdown/min` | ✅ Tested | Postman | clientSelectSearch |
| GET | `/admin/client/dropdown/min/alertGroup` | ✅ Tested | Automation | AlertGroupClientSelection |
| GET | `/admin/client/globalAlert/getAllGroupLists` | ✅ Tested | Automation | multiGroupSelectSearch |
| GET | `/admin/client/globalAlert/getAllUserLists` | ✅ Tested | Automation | multiClientSelectSearch |
| GET | `/admin/client/recent` | ✅ Tested | Postman + Automation | RecentActivatedUser |
| GET | `/admin/client/securitynumber` | ✅ Tested | Postman + Automation | index |
| DELETE | `/admin/client/{id}` | ✅ Tested | Automation | index |
| GET | `/admin/client/{id}` | ✅ Tested | Postman + Automation | ClientAddEdit, ClientView |
| PATCH | `/admin/client/{id}` | ✅ Tested | Postman + Automation | ClientAddEdit |
| GET | `/admin/client/{id}/sendEmail` | ✅ Tested | Postman | index |
| GET | `/admin/emergency` | ✅ Tested | Postman | ArchivedEmergenciesList, Emergencies |
| POST | `/admin/emergency` | ✅ Tested | Postman + Automation | EmergencyCallButton |
| DELETE | `/admin/emergency/archiveEmergency/{id}` | ✅ Tested | Automation | ArchivedEmergenciesList |
| GET | `/admin/emergency/global-active` | ✅ Tested | Postman + Automation | index |
| DELETE | `/admin/emergency/{id}` | ✅ Tested | Automation | EmergenciesList |
| GET | `/admin/emergency/{id}` | ✅ Tested | Postman + Automation | EmergencyDetails |
| PATCH | `/admin/emergency/{id}` | ✅ Tested | Postman + Automation | EmergencyDetails |
| GET | `/admin/entity` | ✅ Tested | Postman | EntitiesList, EntityDropdown |
| POST | `/admin/entity` | ✅ Tested | Postman + Automation | EntityAddEditForm |
| GET | `/admin/entity/changeStatus/{id}` | ✅ Tested | Postman + Automation | EntitiesList |
| GET | `/admin/entity/resendEmail/{id}` | ✅ Tested | Postman | EntitiesList |
| GET | `/admin/entity/{id}` | ✅ Tested | Postman + Automation | AddEntity, index |
| PATCH | `/admin/entity/{id}` | ✅ Tested | Postman + Automation | EntityAddEditForm |
| GET | `/admin/field-operative` | ✅ Tested | Postman + Automation | FieldOperativeList |
| POST | `/admin/field-operative` | ✅ Tested | Postman + Automation | FieldOperativeAddEdit |
| GET | `/admin/field-operative/resendEmail/{id}` | ✅ Tested | Postman | FieldOperativeList |
| DELETE | `/admin/field-operative/{id}` | ✅ Tested | Postman + Automation | FieldOperativeList |
| GET | `/admin/field-operative/{id}` | ✅ Tested | Postman + Automation | FieldOperative |
| PATCH | `/admin/field-operative/{id}` | ✅ Tested | Postman + Automation | FieldOperativeAddEdit |
| GET | `/admin/global-reports` | ✅ Tested | Postman | DownloadCsv, index |
| GET | `/admin/global-reports/analytics` | ✅ Tested | Postman | useUserData |
| GET | `/admin/global-reports/kpis` | ✅ Tested | Postman | ReportService |
| GET | `/admin/globalAlert/history` | ✅ Tested | Postman | GlobalAlertHistory |
| GET | `/admin/monitoring-center` | ✅ Tested | Postman | MonitoringCentreList |
| POST | `/admin/monitoring-center` | ✅ Tested | Postman | MonitoringCentreAddEdit |
| GET | `/admin/monitoring-center/dropdown/min` | ✅ Tested | Postman | AlertGroupMonitoringCenter |
| DELETE | `/admin/monitoring-center/{id}` | ✅ Tested | Postman | MonitoringCentreList |
| GET | `/admin/monitoring-center/{id}` | ✅ Tested | Postman | MonitoringCentre |
| PATCH | `/admin/monitoring-center/{id}` | ✅ Tested | Postman | MonitoringCentreAddEdit |
| GET | `/admin/notifications` | ✅ Tested | Postman | index |
| GET | `/admin/notifications/count` | ✅ Tested | Postman | index |
| GET | `/admin/operational-briefs/assignment-options` | ✅ Tested | Postman | index |
| GET | `/admin/settings` | ✅ Tested | Postman | EmergencyDetails, SettingsAddEdit |
| GET | `/admin/settings/countries` | ✅ Tested | Postman | PhoneNumberInput |
| GET | `/admin/static-pages` | ✅ Tested | Postman + Automation | PagesList |
| GET | `/admin/static-pages/{id}` | ✅ Tested | Automation | PageCreateEdit.page, PageView.page |
| GET | `/admin/super-admin` | ✅ Tested | Postman + Automation | SuperAdminList |
| POST | `/admin/super-admin` | ✅ Tested | Postman + Automation | superAdminAddEdit |
| DELETE | `/admin/super-admin/{id}` | ✅ Tested | Postman + Automation | SuperAdminList |
| GET | `/admin/super-admin/{id}` | ✅ Tested | Postman + Automation | superAdmin |
| PATCH | `/admin/super-admin/{id}` | ✅ Tested | Postman + Automation | superAdminAddEdit |
| GET | `/admin/support-staff` | ✅ Tested | Postman + Automation | SupportStaffList |
| POST | `/admin/support-staff` | ✅ Tested | Postman + Automation | SupportStaffAddEdit |
| DELETE | `/admin/support-staff/{id}` | ✅ Tested | Postman + Automation | SupportStaffList |
| GET | `/admin/support-staff/{id}` | ✅ Tested | Postman + Automation | SupportStaff |
| PATCH | `/admin/support-staff/{id}` | ✅ Tested | Postman + Automation | SupportStaffAddEdit |
| GET | `/admin/user/field-operative/dropdown/min` | ✅ Tested | Automation | AlertGroupFOSelection |
| GET | `/admin/user/maps-data` | ✅ Tested | Postman | GoogleMapReport |
| GET | `/admin/user/report/{id}` | ✅ Tested | Automation | index |
| POST | `/admin/alert` | ⛔ Not run on purpose | Sends a real alert message to users | AddAlertDialog, UserList |
| GET | `/admin/alert/channel/{id}/message/{id}/info` | ⏳ Needs data | Needs real chat history (PubNub channel) | PollMessages |
| DELETE | `/admin/alert/predefined-messages/{id}` | ⏳ Needs data | No predefined messages exist to delete (list is empty) | PredefinedMessageList |
| GET | `/admin/alert/predefined-messages/{id}` | ⏳ Needs data | No predefined messages exist (list is empty) | index |
| POST | `/admin/alert/send-alert-sms` | ⛔ Not run on purpose | Sends a real SMS – test phone numbers could belong to real people | PredefinedMessage, index |
| POST | `/admin/alert/send/predefined-messages` | ⛔ Not run on purpose | Sends real messages to users | AddSentDialog |
| PATCH | `/admin/alert/{id}` | ⛔ Not run on purpose | Changes a live alert conversation | PredefinedMessage, index |
| POST | `/admin/auth/change-password` | ⛔ Not run on purpose | Would change the shared test account password | PasswordChange |
| PATCH | `/admin/auth/me/update` | ⛔ Not run on purpose | Erases fields on the shared account (SPG-BUG-11) – tested once, documented | ProfileDetail, entitySelectNew |
| POST | `/admin/auth/reset-password` | ⏳ Needs data | Needs the emailed reset link; would change the shared password | JWTContext |
| PATCH | `/admin/auth/roles/{id}` | ⛔ Not run on purpose | Changes permissions for every user of a role | Roles |
| PATCH | `/admin/device-info/push-token` | ⛔ Not run on purpose | Registers this browser for push messages | index |
| POST | `/admin/emergency/response/{id}` | ⛔ Not run on purpose | Crashes staging (SPG-BUG-24) | EmergencyDetails |
| POST | `/admin/globalAlert/send` | ⛔ Not run on purpose | Sends a global alert to real users | globalUser |
| POST | `/admin/globalAlert/send/groups` | ⛔ Not run on purpose | Sends a global alert to real groups | globalGroup |
| POST | `/admin/notifications/mark-as-read` | ⛔ Not run on purpose | Changes the shared account's notifications | index |
| POST | `/admin/notifications/mark-as-read/{id}` | ⛔ Not run on purpose | Changes the shared account's notifications | NotificationList |
| DELETE | `/admin/notifications/{id}` | ⛔ Not run on purpose | Deletes the shared account's notifications | NotificationList |
| POST | `/admin/operational-briefs/vehicle-image` | ⏳ Needs data | Trip-brief image upload – flow not yet known | index |
| POST | `/admin/settings` | ⛔ Not run on purpose | Changes system-wide settings | index |
| PATCH | `/admin/settings/{id}` | ⛔ Not run on purpose | Changes system-wide settings | index |
| POST | `/admin/static-pages` | ⛔ Not run on purpose | Creates a public page shown in the apps | PageForm |
| PATCH | `/admin/static-pages/{id}` | ⛔ Not run on purpose | Edits a public page shown in the apps | PageForm |
| GET | `/public/follow-me/{id}/details` | ⏳ Needs data | Needs a real "follow me" link from the mobile app | useFetchFollowMe |

## Checked and found working as designed (not bugs)
- Entity dropdowns filter by `entityId` (not `entity`) – they return only that entity's clients / field operatives.
- The support-staff dropdown needs the entity context (`x-effective-role`) – without it the answer is 403, which matches how the CMS calls it.
- Client status: 3 = invited, 5 = enabled, 2 = disabled. The CMS Enable/Disable button calls `DELETE /admin/client/{id}`; the message "Client enabled successfully" is correct when an invited client becomes enabled.
