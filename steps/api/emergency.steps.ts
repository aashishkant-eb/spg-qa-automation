import { expect } from '@playwright/test';
import { redact } from '../../support/redact';
import { When, Then } from '../fixtures';
import { ENTITY_ROLE } from '../../support/testData';

When('I start an emergency for the client', async ({ api, world, cleanup }) => {
  world.last = await api.post('/admin/emergency', { clientId: world.ids.client, silentDuress: false }, { role: ENTITY_ROLE });
  expect([200, 201], redact(world.last.body, 200)).toContain(world.last.status);
  world.ids.emergency = world.last.body.data._id;
  // Never leave a QA emergency open on the shared dashboard.
  cleanup.add('emergency', async () => {
    const e = await api.get(`/admin/emergency/${world.ids.emergency}`, { role: ENTITY_ROLE });
    if (e.body?.data?.status === 1) await api.patch(`/admin/emergency/${world.ids.emergency}`, {}, { role: ENTITY_ROLE });
  });
});

Then('the emergency is active', async ({ api, world }) => {
  expect((await api.get(`/admin/emergency/${world.ids.emergency}`, { role: ENTITY_ROLE })).body.data.status).toBe(1);
});

When('I mark the emergency as safe', async ({ api, world }) => {
  // Same call as the CMS "Mark as safe" button: PATCH with an empty body.
  world.last = await api.patch(`/admin/emergency/${world.ids.emergency}`, {}, { role: ENTITY_ROLE });
});

Then('the emergency is closed', async ({ api, world }) => {
  const d = (await api.get(`/admin/emergency/${world.ids.emergency}`, { role: ENTITY_ROLE })).body.data;
  expect(d.status).toBe(0);
  expect(d.emergencyEnd).toBeTruthy();
});

When('I delete the emergency', async ({ api, world }) => {
  world.last = await api.delete(`/admin/emergency/${world.ids.emergency}`, { role: ENTITY_ROLE });
});

When('I delete the emergency from the archive', async ({ api, world }) => {
  world.last = await api.delete(`/admin/emergency/archiveEmergency/${world.ids.emergency}`, { role: ENTITY_ROLE });
});

Then('the emergency no longer exists', async ({ api, world }) => {
  expect((await api.get(`/admin/emergency/${world.ids.emergency}`, { role: ENTITY_ROLE })).status).toBe(404);
});
