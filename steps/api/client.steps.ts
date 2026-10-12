import { expect } from '@playwright/test';
import { When, Then } from '../fixtures';
import { ENTITY_ROLE, clientBody } from '../../support/testData';

When('I create a client for the entity', async ({ api, world, cleanup }) => {
  const body = clientBody(world.ids.entity, world.ids.securityNumber);
  world.bodies.client = body;
  world.last = await api.post('/admin/client/', body, { role: ENTITY_ROLE });
  if (world.last.status === 201) {
    world.ids.client = world.last.body.data._id;
    cleanup.add('client', () => api.delete(`/admin/client/delete/${world.ids.client}`, { role: ENTITY_ROLE }));
  }
});

Then('the client is linked to the entity, security number and emergency contact', async ({ api, world }) => {
  const d = (await api.get(`/admin/client/${world.ids.client}`, { role: ENTITY_ROLE })).body.data;
  expect(d.callSecurityNumberId).toBe(world.ids.securityNumber);
  expect(d.app).toBe('secure');
  expect(d.standardOperatingProcedure).toBe(world.bodies.client.standardOperatingProcedure);
  expect(JSON.stringify(d)).toContain(world.bodies.client.emergencyContact[0].phoneNumber);
  const listed = await api.get(`/admin/client?pageSize=50&currentPage=1&entityId=${world.ids.entity}`, { role: ENTITY_ROLE });
  expect(JSON.stringify(listed.body)).toContain(world.ids.client);
});

When('I change the client, partner and dependent photos to the uploaded photo', async ({ api, world }) => {
  const b = structuredClone(world.bodies.client);
  b.clientDetails.profilePhoto = world.photoKey;
  b.familyDetails = {
    partnersName: 'QA Partner', partnersJobLocation: 'Sydney', partnerProfilePhoto: world.photoKey,
    dependents: [{ dependentsName: 'QA Dependent', dependentsSchool: 'QA School', dependentsProfilePhoto: world.photoKey }],
  };
  world.last = await api.patch(`/admin/client/${world.ids.client}`, b, { role: ENTITY_ROLE });
});

Then('all client photos are the uploaded photo', async ({ api, world }) => {
  const d = (await api.get(`/admin/client/${world.ids.client}`, { role: ENTITY_ROLE })).body.data;
  expect(d.profilePhoto).toBe(world.photoKey);
  expect(d.familyDetails.partnerProfilePhoto).toBe(world.photoKey);
  expect(d.familyDetails.dependents[0].dependentsProfilePhoto).toBe(world.photoKey);
});

When('I rename the call security number to {string}', async ({ api, world }, name: string) => {
  const list = (await api.get(`/admin/callSecurityNumberSettings?entity=${world.ids.entity}`, { role: ENTITY_ROLE })).body.data[0];
  const n = list.phoneNumbers[0];
  world.last = await api.patch(`/admin/callSecurityNumberSettings/${list._id}`,
    { entity: world.ids.entity, phoneNumbers: [{ phoneNumber: n.phoneNumber, countryCode: n.countryCode, name }] }, { role: ENTITY_ROLE });
});

Then('the call security number is called {string}', async ({ api, world }, name: string) => {
  const list = (await api.get(`/admin/callSecurityNumberSettings?entity=${world.ids.entity}`, { role: ENTITY_ROLE })).body.data[0];
  expect(list.phoneNumbers[0].name).toBe(name);
});

// CMS client statuses: 3 = invited, 5 = enabled, 2 = disabled. The CMS "Enable/Disable" button calls DELETE /admin/client/:id.
const CLIENT_STATUS: Record<string, number> = { invited: 3, enabled: 5, disabled: 2 };

When('I switch the client status', async ({ api, world }) => {
  world.last = await api.delete(`/admin/client/${world.ids.client}`, { role: ENTITY_ROLE });
  expect(world.last.status).toBe(200);
});

Then('the client status is {string}', async ({ api, world }, state: string) => {
  const d = (await api.get(`/admin/client/${world.ids.client}`, { role: ENTITY_ROLE })).body.data;
  expect(d.status, `client should be ${state}`).toBe(CLIENT_STATUS[state]);
});

When("I open the client's alert history", async ({ api, world }) => {
  world.last = await api.get(`/admin/alert/get-alert-sms/${world.ids.client}`, { role: ENTITY_ROLE });
});
