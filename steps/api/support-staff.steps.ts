import { expect } from '@playwright/test';
import { When, Then } from '../fixtures';
import { supportStaffBody } from '../../support/testData';
import { ensureQaSupportStaff } from '../../support/qaFixtures';

// SPG cannot delete support staff: DELETE /admin/support-staff/:id is the CMS Enable/Disable switch (2 = disabled).
const disableIfActive = async (api: any, id: string) => {
  const d = (await api.get(`/admin/support-staff/${id}`)).body?.data;
  if (d && d.status !== 2) await api.delete(`/admin/support-staff/${id}`);
};

const findByName = async (api: any, name: string) =>
  (await api.get(`/admin/support-staff?currentPage=1&pageSize=20&search=${encodeURIComponent(name)}`)).body.data.docs.filter((d: any) => d.fullName === name);

When('I create a support staff user', async ({ api, world, cleanup }) => {
  const body = supportStaffBody();
  world.bodies.supportStaff = body;
  world.last = await api.post('/admin/support-staff', body);
  if (world.last.status === 201) {
    world.ids.supportStaff = world.last.body.data._id;
    cleanup.add('disable support staff', () => disableIfActive(api, world.ids.supportStaff));
  }
});

When('I create a support staff user with {string} set to {string}', async ({ api, world, cleanup }, field: string, value: string) => {
  let v: string = value;
  if (value === 'DUPLICATE') {
    // A real existing email: the shared QA support staff user's email.
    v = (await ensureQaSupportStaff(api)).body.email;
  } else if (field === 'email' && value) {
    v = `${value}-${Date.now()}`;
  }
  const body = supportStaffBody({ [field]: v });
  if (field === 'fullName' && !value) body.fullName = '';
  world.bodies.supportStaff = body;
  world.last = await api.post('/admin/support-staff', body);
  // The API sometimes saves invalid records (SPG-BUG-06): always clean up by name.
  cleanup.add('disable wrongly saved support staff', async () => {
    if (!body.fullName) return;
    for (const d of await findByName(api, body.fullName)) await disableIfActive(api, d._id);
  });
});

Then('the new support staff user is in the support staff list', async ({ api, world }) => {
  const found = await findByName(api, world.bodies.supportStaff.fullName);
  expect(found.map((d: any) => d._id)).toContain(world.ids.supportStaff);
});

Then('no support staff user with that name is saved', async ({ api, world }) => {
  const name = world.bodies.supportStaff.fullName;
  if (!name) return; // nothing searchable when the name itself was the invalid field
  expect(await findByName(api, name)).toHaveLength(0);
});

When("I change the support staff user's photo to the uploaded photo", async ({ api, world }) => {
  // PATCH needs the full object – partial bodies are rejected with 422.
  world.last = await api.patch(`/admin/support-staff/${world.ids.supportStaff}`, { ...world.bodies.supportStaff, profilePhoto: world.photoKey });
});

Then("the support staff user's saved photo is the uploaded photo", async ({ api, world }) => {
  const r = await api.get(`/admin/support-staff/${world.ids.supportStaff}`);
  expect(r.body.data.profilePhoto).toBe(world.photoKey);
});

When('I open page 1 and page 2 of the support staff list', async ({ api, world }) => {
  world.ids.page1 = JSON.stringify((await api.get('/admin/support-staff?currentPage=1&pageSize=3')).body.data.docs.map((d: any) => d._id));
  world.ids.page2 = JSON.stringify((await api.get('/admin/support-staff?currentPage=2&pageSize=3')).body.data.docs.map((d: any) => d._id));
});

Then('the two pages show different people', async ({ world }) => {
  expect(world.ids.page2).not.toBe(world.ids.page1);
});
