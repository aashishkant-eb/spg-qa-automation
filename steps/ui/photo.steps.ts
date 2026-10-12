import path from 'node:path';
import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';
import { readSession } from '../../support/apiClient';

// CMS edit page and the API record it saves to, per kind of user.
const EDIT_PAGES: Record<string, { page: (ids: Record<string, string>) => string; api: (ids: Record<string, string>) => string }> = {
  'field operative': { page: (ids) => `/field-operative/update/${ids.fieldOperative}`, api: (ids) => `/admin/field-operative/${ids.fieldOperative}` },
  'super admin': { page: (ids) => `/superAdmin/update/${ids.superAdmin}`, api: (ids) => `/admin/super-admin/${ids.superAdmin}` },
};

Given('I am signed in to the CMS', async ({ page }) => {
  // Reuse the API session instead of the login form: a second login would end the API session (one session per account).
  const { token } = readSession();
  await page.addInitScript((t) => window.localStorage.setItem('serviceToken', t), token);
  await page.goto('/');
  await expect(page).not.toHaveURL(/\/login/, { timeout: 20_000 });
});

When(/^I open the (field operative|super admin) edit page$/, async ({ page, world }, kind: string) => {
  world.ids.editUrl = EDIT_PAGES[kind].page(world.ids);
  world.ids.apiPath = EDIT_PAGES[kind].api(world.ids);
  await page.goto(world.ids.editUrl);
  await page.locator('#upload-imageprofilePhoto').waitFor({ state: 'attached', timeout: 30_000 });
});

When('I upload and crop the photo {string}', async ({ page, world }, fileName: string) => {
  await page.setInputFiles('#upload-imageprofilePhoto', path.resolve('test-data', fileName));
  const upload = page.waitForResponse((r) => /amazonaws\.com/.test(r.url()) && ['PUT', 'POST'].includes(r.request().method()), { timeout: 30_000 });
  await page.getByRole('button', { name: 'Crop' }).click();
  const res = await upload;
  expect(res.ok(), `S3 upload HTTP ${res.status()}`).toBeTruthy();
  // The CMS puts the new key into the form only after the upload promise resolves – wait for its spinner to go.
  await expect(page.getByRole('progressbar')).toHaveCount(0, { timeout: 15_000 });
  world.ids.uploadedFile = fileName;
});

When('I save the form', async ({ page, world }) => {
  // Wait for THIS record's save – the CMS also sends unrelated PATCHes (e.g. push-token) on every page.
  const saved = page.waitForResponse((r) => r.request().method() === 'PATCH' && r.url().endsWith(world.ids.apiPath), { timeout: 30_000 });
  await page.locator('button[type="submit"]').first().click();
  const res = await saved;
  expect(res.status()).toBe(200);
  if (world.ids.uploadedFile) {
    const sent = res.request().postData() ?? '';
    expect(sent, 'the save request must contain the uploaded photo (if not: Update was sent before the upload finished – SPG-SUS-12)').toContain(world.ids.uploadedFile);
  }
});

When('I reopen the edit page', async ({ page, world }) => {
  await page.goto(world.ids.editUrl);
  await page.locator('#upload-imageprofilePhoto').waitFor({ state: 'attached', timeout: 30_000 });
});

Then('the saved photo is shown', async ({ page, world, api }) => {
  const file = world.ids.uploadedFile;
  // First prove the save worked, so a display failure is never confused with a save failure.
  const stored = (await api.get(world.ids.apiPath)).body.data.profilePhoto ?? '';
  expect(stored, 'photo key stored by the API').toContain(file);
  await expect
    .poll(async () => page.$$eval('img', (imgs, f) => imgs.some((i) => decodeURIComponent(i.src).includes(f) && i.naturalWidth > 1), file), {
      message: `an <img> showing ${file}`, timeout: 20_000,
    })
    .toBe(true);
});
