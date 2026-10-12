// "Given … exists" steps: create QA test data and register its cleanup. Shared by API and UI features.
import { expect } from '@playwright/test';
import { redact } from '../support/redact';
import { Given } from './fixtures';
import { ENTITY_ROLE, auPhone, clientBody, entityStaffBody, superAdminBody } from '../support/testData';
import { ensureQaEntity, ensureQaFieldOperative, ensureQaSupportStaff } from '../support/qaFixtures';

Given('a support staff user exists', async ({ api, world }) => {
  // Shared QA user – SPG cannot delete support staff, so we reuse one instead of creating a new one each run.
  const st = await ensureQaSupportStaff(api);
  world.ids.supportStaff = st.id;
  world.bodies.supportStaff = st.body;
});

Given('a super admin exists', async ({ api, world, cleanup }) => {
  const body = superAdminBody();
  const r = await api.post('/admin/super-admin', body);
  expect(r.status).toBe(201);
  world.ids.superAdmin = r.body.data._id;
  world.bodies.superAdmin = body;
  cleanup.add('super admin', () => api.delete(`/admin/super-admin/${r.body.data._id}`));
});

Given('an entity exists', async ({ api, world }) => {
  // Shared QA entity – SPG has no entity delete, so every run reuses the same one (re-enabled if needed).
  const e = await ensureQaEntity(api);
  world.ids.entity = e.id;
  world.ids.principalAdmin = e.principalAdminId;
  world.bodies.entity = e.body;
});

Given('the entity has a call security number', async ({ api, world }) => {
  // Reuse the entity's first security number; add one only if it has none.
  const list = await api.get(`/admin/callSecurityNumberSettings?entity=${world.ids.entity}`, { role: ENTITY_ROLE });
  const existing = list.body?.data?.[0]?.phoneNumbers?.[0];
  if (existing) { world.ids.securityNumber = existing._id; return; }
  const r = await api.post('/admin/callSecurityNumberSettings',
    { entity: world.ids.entity, phoneNumbers: [{ phoneNumber: auPhone(), countryCode: '+61', name: 'QA Security Line' }] }, { role: ENTITY_ROLE });
  expect(r.status).toBe(200);
  world.ids.securityNumber = r.body.data.phoneNumbers[0]._id;
});

Given('a client exists for the entity', async ({ api, world, cleanup }) => {
  const body = clientBody(world.ids.entity, world.ids.securityNumber);
  const r = await api.post('/admin/client/', body, { role: ENTITY_ROLE });
  expect(r.status, redact(r.body, 200)).toBe(201);
  world.ids.client = r.body.data._id;
  world.bodies.client = body;
  cleanup.add('client', () => api.delete(`/admin/client/delete/${r.body.data._id}`, { role: ENTITY_ROLE }));
});

Given('a field operative exists for the entity', async ({ api, world }) => {
  // Shared QA field operative – the CMS has no delete for field operatives, only Enable/Disable.
  const fo = await ensureQaFieldOperative(api, world.ids.entity);
  world.ids.fieldOperative = fo.id;
  world.bodies.fieldOperative = fo.body;
});

Given('an entity support staff user is added to the entity', async ({ api, world, cleanup }) => {
  const r = await api.post('/admin/admins', entityStaffBody(world.ids.entity, 'entitySupportStaff'), { role: ENTITY_ROLE });
  expect(r.status).toBe(201);
  world.ids.entityStaff = r.body.data._id;
  // SPG cannot delete entity users from the CMS (SPG-BUG-23); this call is the CMS "Disable" button.
  cleanup.add('disable entity support staff', () => api.delete(`/admin/admins/${r.body.data._id}`));
});
