import { expect } from '@playwright/test';
import { DataTable } from 'playwright-bdd';
import { Given, When, Then } from '../fixtures';
import { env } from '../../support/env';

Given('I open the CMS login page', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('input[name="email"]')).toBeVisible();
});

When('I sign in with a wrong password', async ({ page }) => {
  // A failed login does not start a session, so the shared test session stays valid.
  await page.fill('input[name="email"]', env.adminEmail);
  await page.fill('input[name="password"]', 'wrong-password-qa');
  const res = page.waitForResponse((r) => r.url().includes('/admin/auth/login'));
  await page.keyboard.press('Enter');
  expect((await res).status()).toBe(401);
});

Then('I see the login error {string}', async ({ page }, message: string) => {
  await expect(page.getByText(message)).toBeVisible();
});

Then('I am still on the login page', async ({ page }) => {
  await expect(page).toHaveURL(/\/login/);
});

Then('the main menu shows these items:', async ({ page }, table: DataTable) => {
  for (const [item] of table.raw()) await expect(page.getByText(item, { exact: true }).first()).toBeVisible();
});

When('I open the entity edit page', async ({ page, world }) => {
  await page.goto(`/entities/update/${world.ids.entity}`);
  await expect(page.locator('input[name="adminEmail"]')).not.toHaveValue('', { timeout: 30_000 });
});

Then('the principal admin email shows the original principal admin', async ({ page, world }) => {
  await expect(page.locator('input[name="adminEmail"]')).toHaveValue(world.bodies.entity.principalAdminDetails.email);
});
