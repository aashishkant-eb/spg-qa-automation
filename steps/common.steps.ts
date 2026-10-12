import { expect } from '@playwright/test';
import { redact } from '../support/redact';
import { Given, Then } from './fixtures';
import { uploadPhoto } from '../support/photoUpload';

Given('I am logged in as a super admin', async ({ api }) => {
  const me = await api.get('/admin/auth/me');
  expect(me.status, 'session is valid').toBe(200);
  expect(me.body.role).toBe('spgSuperAdmin');
});

Given('I have uploaded the photo {string}', async ({ world }, fileName: string) => {
  world.photoKey = await uploadPhoto(fileName);
});

Then('the response status is {int}', async ({ world }, status: number) => {
  expect(world.last, 'a request was sent').toBeDefined();
  expect(world.last!.status, `${world.last!.method} ${world.last!.path} → ${redact(world.last!.body)}`).toBe(status);
});

Then('the response message is {string}', async ({ world }, message: string) => {
  expect(world.last!.body?.message).toBe(message);
});

Then('the response message mentions {string}', async ({ world }, text: string) => {
  expect(JSON.stringify(world.last!.body).toLowerCase()).toContain(text.toLowerCase());
});

Then('the response does not contain password hashes', async ({ world }) => {
  // Count only – never print the response, or the hashes would end up in the reports.
  const text = JSON.stringify(world.last!.body);
  expect((text.match(/"password":"\$2[aby]\$/g) ?? []).length, 'number of password hashes in the response').toBe(0);
  expect((text.match(/"pushToken"/g) ?? []).length, 'number of push tokens in the response').toBe(0);
});

Then('the response time is recorded against the {int} ms SRS limit', async ({ world, $testInfo }, limit: number) => {
  // Timing on shared staging varies run to run (SPG-BUG-21 measured 2.9–3.4 s), so record it instead of failing.
  const ms = world.last!.ms;
  const verdict = ms <= limit ? 'within limit' : 'OVER LIMIT';
  $testInfo.annotations.push({ type: 'performance', description: `${ms} ms – ${verdict} (${limit} ms)` });
  await $testInfo.attach('response-time', { body: `${ms} ms – ${verdict} (SRS limit ${limit} ms)`, contentType: 'text/plain' });
  console.log(`[performance] ${world.last!.method} ${world.last!.path}: ${ms} ms – ${verdict}`);
});

Then('the response contains a list', async ({ world }) => {
  const d = world.last!.body?.data;
  expect(Array.isArray(d) || Array.isArray(d?.docs)).toBe(true);
});
