# Example – `api-testcase-generator` on SPG Support Staff API

## 1. Endpoint summary
| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | /admin/support-staff | Bearer | Create |
| GET | /admin/support-staff?currentPage&pageSize&search | Bearer | List / search |
| GET | /admin/support-staff/{id} | Bearer | Detail |
| PATCH | /admin/support-staff/{id} | Bearer | Update – **full object required** |
| DELETE | /admin/support-staff/{id} | Bearer | Disable (the CMS “Delete” is an Enable/Disable toggle) |

## 2. Test cases
| ID | Endpoint | Case | Data | Expected status | Expected result | Type |
|---|---|---|---|---|---|---|
| TC-SS-001 | POST | Create valid user | DDT row `valid` | 201 | Record in list | Positive |
| TC-SS-003a | POST | Missing name | `fullName=""` | 422 | Nothing saved | Negative |
| TC-SS-003b | POST | Duplicate email | existing email | 422 | "Email already exists" | Negative |
| TC-SS-003c | POST | Invalid email | `not-an-email` | 422 | Nothing saved (today: 400 + saved – SPG-BUG-06) | Negative |
| TC-SS-004 | POST | Empty phone | `contactNumber=""` | 422 | "required" (today: "already exists" – SPG-BUG-08) | Negative |
| TC-SS-002 | PATCH | Change photo | full body + `profilePhoto` | 200 | GET shows new key | Positive |
| TC-SS-006 | PATCH | Partial body | `{title}` only | 422 | Nothing changed | Negative |
| TC-SS-005 | GET | Page 2 | `currentPage=2` | 200 | Different records (today same – SPG-BUG-04) | Pagination |
| TC-SS-007 | GET | No token | – | 401 | – | Security |
| TC-SS-008 | GET | Response hygiene | – | 200 | No `password` / `pushToken` (SPG-BUG-01) | Security |

## 3. DDT CSV
See [`test-data/support-staff-ddt.csv`](../../test-data/support-staff-ddt.csv) – use with Postman Runner → *Select File* or `newman run … -d`.

## 4. Postman tests
```javascript
pm.test('Status is 422 for invalid input', () => pm.response.to.have.status(Number(pm.iterationData.get('expectedStatus'))));
pm.test('No raw DB/AWS errors', () => {
  const t = pm.response.text();
  pm.expect(t).to.not.include('ValidatorError');
  pm.expect(t).to.not.include('InvalidParameterValue');
});
pm.test('No password hash in response', () => pm.expect(pm.response.text()).to.not.match(/"password":"\$2[aby]\$/));
```

## 5. Assumptions to confirm
- Max name length (not documented).
- Whether delete should be soft (status 2) or hard.
