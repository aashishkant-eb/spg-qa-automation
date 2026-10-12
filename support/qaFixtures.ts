// Fixed QA records reused by every run, so test runs do NOT pile up records SPG cannot delete.
// SPG has no delete for entities, field operatives or support staff: the CMS "Delete"/"Disable" buttons
// only switch them between enabled (5/1) and disabled (2). So we create these ONCE, find them by their
// fixed email on every run, and re-enable them if someone disabled them.
import { expect } from '@playwright/test';
import type { SpgApi } from './apiClient';
import { ENTITY_ROLE, auPhone } from './testData';

export const QA = {
  entityName: 'QA Automation Entity (do not delete)',
  entityEmail: 'qa.automation.entity@example.com',
  principalEmail: 'qa.automation.principal@example.com',
  foEmail: 'qa.automation.fo@example.com',
  staffName: 'QA Automation Support Staff',
  staffEmail: 'qa.automation.staff@example.com',
};

const DISABLED = 2;

export type QaEntity = { id: string; principalAdminId: string; body: any };

/** Find (or create once) the shared QA entity, make sure it is active, and return its real principal admin. */
export async function ensureQaEntity(api: SpgApi): Promise<QaEntity> {
  const list = await api.get('/admin/entity?page=1&limit=10000');
  expect(list.status, 'entity list').toBe(200);
  let entity = list.body.data.docs.find((e: any) => e.email === QA.entityEmail);
  const body = {
    entityDetails: { name: QA.entityName, email: QA.entityEmail, entityPhone: entity?.entityPhone ?? auPhone(), countryCode: '+61', entityLogo: entity?.entityLogo ?? '' },
    principalAdminDetails: { fullName: 'QA Automation Principal', email: QA.principalEmail, contactNumber: auPhone(), countryCode: '+61', title: 'QA Lead', profilePhoto: '', id: null as string | null },
    api: { username: null, password: null },
  };
  if (!entity) {
    const r = await api.post('/admin/entity', body);
    expect(r.status, 'create shared QA entity').toBe(201);
    entity = { _id: r.body.data._id, isEntityActive: true };
  }
  if (entity.isEntityActive === false) await api.get(`/admin/entity/changeStatus/${entity._id}`);
  // Read the principal admin from the admin list, NOT from the entity (the entity can return the wrong person – SPG-BUG-02).
  const admins = await api.get(`/admin/admins?page=1&limit=100&entity=${entity._id}&role=entityPrincipalAdmin`, { role: ENTITY_ROLE });
  const principal = (admins.body.data?.docs ?? []).find((a: any) => a.email === QA.principalEmail);
  expect(principal, 'shared QA entity has its principal admin').toBeTruthy();
  body.principalAdminDetails.contactNumber = principal.contactNumber;
  body.principalAdminDetails.id = principal._id;
  return { id: entity._id, principalAdminId: principal._id, body };
}

/** Find (or create once) the shared QA field operative for the entity, and make sure it is enabled. */
export async function ensureQaFieldOperative(api: SpgApi, entityId: string): Promise<{ id: string; body: any }> {
  const find = async () => (await api.get(`/admin/field-operative?currentPage=1&pageSize=5&search=${encodeURIComponent(QA.foEmail)}`))
    .body.data.docs.find((d: any) => d.email === QA.foEmail);
  let fo = await find();
  if (!fo) {
    const r = await api.post('/admin/field-operative', { entity: [entityId], alertGroup: [], safeWord: 'qasafe', duressWord: 'qaduress',
      profilePhoto: null, email: QA.foEmail, fullName: 'QA Automation FieldOp', phoneNumber: auPhone(), countryCode: '+61', currentCity: null });
    expect(r.status, 'create shared QA field operative').toBe(201);
    fo = await find();
  }
  if (fo.status === DISABLED) await api.delete(`/admin/field-operative/${fo._id}`); // CMS "Enable"
  return { id: fo._id, body: { entity: [entityId], alertGroup: [], safeWord: 'qasafe', duressWord: 'qaduress', profilePhoto: fo.profilePhoto ?? null,
    email: fo.email, fullName: `${fo.firstName} ${fo.lastName}`, phoneNumber: fo.phoneNumber, countryCode: fo.countryCode, currentCity: null } };
}

/** Find (or create once) the shared QA support staff user, and make sure it is enabled. */
export async function ensureQaSupportStaff(api: SpgApi): Promise<{ id: string; body: any }> {
  const find = async () => (await api.get(`/admin/support-staff?currentPage=1&pageSize=20&search=${encodeURIComponent(QA.staffName)}`))
    .body.data.docs.find((d: any) => d.email === QA.staffEmail);
  let st = await find();
  if (!st) {
    const r = await api.post('/admin/support-staff', { fullName: QA.staffName, email: QA.staffEmail, profilePhoto: null, countryCode: '+61', contactNumber: auPhone(), title: 'QA Lead' });
    expect(r.status, 'create shared QA support staff').toBe(201);
    st = await find();
  }
  if (st.status === DISABLED) await api.delete(`/admin/support-staff/${st._id}`); // CMS "Enable"
  return { id: st._id, body: { fullName: st.fullName, email: st.email, profilePhoto: st.profilePhoto ?? null, countryCode: st.countryCode, contactNumber: st.contactNumber, title: st.title } };
}
