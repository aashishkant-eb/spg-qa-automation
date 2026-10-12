import { expect } from '@playwright/test';
import { DataTable } from 'playwright-bdd';
import { When, Then } from '../fixtures';
import { ENTITY_ROLE } from '../../support/testData';
import { redact } from '../../support/redact';

Then('these lists load:', async ({ api, world }, table: DataTable) => {
  for (const row of table.hashes()) {
    const path = row.path.replace('{entity}', world.ids.entity ?? '');
    const r = await api.get(path, row.context === 'entity' ? { role: ENTITY_ROLE } : {});
    expect(r.status, `${row.name}: ${redact(r.body, 150)}`).toBe(200);
    const d = r.body?.data;
    expect(Array.isArray(d) || Array.isArray(d?.docs), `${row.name} returns a list`).toBe(true);
  }
});

When('I open the first static page', async ({ api, world }) => {
  const list = (await api.get('/admin/static-pages')).body.data;
  const first = (Array.isArray(list) ? list : list.docs)[0];
  expect(first, 'at least one static page exists').toBeTruthy();
  world.last = await api.get(`/admin/static-pages/${first._id}`);
});

Then('the page has a title and content', async ({ world }) => {
  expect(world.last!.body.data.title).toBeTruthy();
  expect(world.last!.body.data).toHaveProperty('content');
});
