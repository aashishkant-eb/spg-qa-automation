import { expect } from '@playwright/test';
import { When, Then } from '../fixtures';
import { env } from '../../support/env';

When('I open my profile', async ({ api, world }) => {
  world.last = await api.get('/admin/auth/me');
});

Then('my profile shows the super admin role', async ({ world }) => {
  expect(world.last!.body.role).toBe('spgSuperAdmin');
  expect(world.last!.body.email).toBe(env.adminEmail);
});

When('I list super admins without logging in', async ({ api, world }) => {
  world.last = await api.get('/admin/super-admin?currentPage=1&pageSize=1', { auth: false });
});

When('I open the dashboard counts without logging in', async ({ api, world }) => {
  world.last = await api.get('/admin/auth/count', { auth: false });
});

When('I log in with a wrong password', async ({ api, world }) => {
  world.last = await api.post('/admin/auth/login', { email: env.adminEmail, password: 'wrong-password-qa' }, { auth: false });
});

When('I log in with an unknown email', async ({ api, world }) => {
  world.last = await api.post('/admin/auth/login', { email: `nobody.${Date.now()}@example.com`, password: 'wrong-password-qa' }, { auth: false });
});

When('I list support staff', async ({ api, world }) => {
  world.last = await api.get('/admin/support-staff?currentPage=1&pageSize=10');
});
