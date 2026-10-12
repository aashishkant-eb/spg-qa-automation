import { expect } from '@playwright/test';
import { When, Then } from '../fixtures';
import { ENTITY_ROLE } from '../../support/testData';

When('I change the entity logo and principal admin photo to the uploaded photo', async ({ api, world }) => {
  const b = structuredClone(world.bodies.entity);
  b.entityDetails.entityLogo = world.photoKey;
  b.principalAdminDetails.profilePhoto = world.photoKey;
  b.principalAdminDetails.id = world.ids.principalAdmin;
  world.last = await api.patch(`/admin/entity/${world.ids.entity}`, b);
});

Then('the entity logo and principal admin photo are the uploaded photo', async ({ api, world }) => {
  const d = (await api.get(`/admin/entity/${world.ids.entity}`)).body.data;
  expect(d.entityLogo).toBe(world.photoKey);
  expect(d.principalAdminDetails.profilePhoto).toBe(world.photoKey);
});

When('I switch the entity status', async ({ api, world }) => {
  // The API toggles status with a GET request (SPG-BUG-13 – it should be a PATCH).
  world.last = await api.get(`/admin/entity/changeStatus/${world.ids.entity}`);
  expect(world.last.status).toBe(200);
});

Then('the entity is inactive', async ({ api, world }) => {
  expect((await api.get(`/admin/entity/${world.ids.entity}`)).body.data.isEntityActive).toBe(false);
});

Then('the entity is active', async ({ api, world }) => {
  expect((await api.get(`/admin/entity/${world.ids.entity}`)).body.data.isEntityActive).toBe(true);
});


Then('the entity principal admin is still the original principal admin', async ({ api, world }) => {
  const d = (await api.get(`/admin/entity/${world.ids.entity}`)).body.data;
  expect(d.principalAdminDetails._id).toBe(world.ids.principalAdmin);
});

When('I delete that user the way the CMS does', async ({ api, world }) => {
  world.last = await api.delete(`/admin/admins/delete/${world.ids.entityStaff}`, { role: ENTITY_ROLE });
});
