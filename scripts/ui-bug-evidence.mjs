#!/usr/bin/env node
// Re-checks the CMS (UI) bugs on the real screens and saves screenshots for the Jira tickets.
// Creates only 1 client (deleted at the end). Every check records REPRODUCED / NOT SEEN / NOT CHECKED (UI step failed).
// Usage: node scripts/ui-bug-evidence.mjs   (reads .env)
import 'dotenv/config';
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const API = process.env.SPG_API_URL ?? 'https://stageapi.red.global/v1';
const CMS = process.env.SPG_CMS_URL ?? 'https://stagecms.red.global';
const OUT = 'reports/ui-bug-evidence'; fs.mkdirSync(OUT, { recursive: true });
const ROLE = { 'x-effective-role': 'entityPrincipalAdmin' };
const phone = () => '4' + Math.floor(10_000_000 + Math.random() * 89_999_999);
const stamp = Date.now();
const results = [];
// ok: true = bug seen, false = bug not seen, null = the check itself could not run (never counted as a bug)
const record = (bug, ok, detail, shots) => {
  const result = ok === null ? 'NOT CHECKED' : ok ? 'REPRODUCED' : 'NOT SEEN';
  results.push({ bug, result, detail, screenshots: shots });
  console.log(`${result.padEnd(11)} ${bug} – ${detail}`);
};

const login = await (await fetch(API + '/admin/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: process.env.SPG_ADMIN_EMAIL, password: process.env.SPG_ADMIN_PASSWORD }) })).json();
const token = login.data.token.accessToken;
const api = async (method, path, body, headers = {}) => {
  const r = await fetch(API + path, { method, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token, ...headers }, body: body ? JSON.stringify(body) : undefined });
  return { status: r.status, body: await r.json().catch(() => null) };
};

// Shared QA entity (created by the automation) + its security number
const entity = (await api('GET', '/admin/entity?page=1&limit=10000')).body.data.docs.find((e) => e.email === 'qa.automation.entity@example.com');
if (!entity) throw new Error('Run the automation once first (it creates the shared QA entity).');
const sec = (await api('GET', `/admin/callSecurityNumberSettings?entity=${entity._id}`, null, ROLE)).body.data?.[0]?.phoneNumbers?.[0];

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await ctx.addInitScript((t) => localStorage.setItem('serviceToken', t), token);
const page = await ctx.newPage();
const pageErrors = []; page.on('pageerror', (e) => pageErrors.push(e.message.slice(0, 160)));
const shot = async (name) => { const f = `${OUT}/${name}.png`; await page.screenshot({ path: f, fullPage: true }); return f; };

// 1) Super Admin clicks User Management in the menu → the panel stays empty
await page.goto(CMS + '/dashboard'); await page.waitForTimeout(5000);
let menuOk = true;
try { await page.getByText('User Management', { exact: true }).first().click(); } catch { menuOk = false; }
await page.waitForTimeout(8000);
const tabs = await page.getByRole('tab').count();
const s0 = await shot('UI-01_user-management_empty');
record('User Management page is empty for Super Admin', menuOk ? tabs === 0 : null,
  menuOk ? `tabs shown: ${tabs}; url: ${page.url().replace(CMS, '')}; page errors: ${JSON.stringify(pageErrors.slice(0, 2))}` : 'menu item not found', [s0]);

// 2) Support staff list: page 2 shows page 1 again (SPG-BUG-04)
await page.goto(CMS + '/users#support-staff'); await page.waitForTimeout(6000);
const rowsText = async () => (await page.locator('table tbody tr').allInnerTexts()).slice(0, 5).join(' | ');
const p1 = await rowsText(); const s1 = await shot('BUG-04_support-staff_page1');
let p2 = null;
try { await page.getByRole('button', { name: /next page/i }).click(); await page.waitForTimeout(4000); p2 = await rowsText(); } catch (e) { console.warn('Next page:', e.message); }
const s2 = await shot('BUG-04_support-staff_page2');
record('SPG-BUG-04 support staff page 2', p2 === null || !p1 ? null : p1 === p2, p2 === null ? 'next page button not usable' : p1 === p2 ? 'page 2 shows exactly the same people as page 1' : 'pages differ', [s1, s2]);

// 3) Client location filled with "Exmouth" although none was chosen (regression of ES1SPGSLV-775)
const client = await api('POST', '/admin/client/', {
  clientDetails: { firstName: 'QA', lastName: 'UI Evidence ' + stamp, safeWord: 'qasafe', duressWord: 'qaduress', email: `qa.uiev.${stamp}@example.com`, homeAddress: '1 Test Street, Sydney NSW', workAddress: '2 Test Street, Sydney NSW', countryCode: '+61', phoneNumber: phone(), profilePhoto: '', patriotClientNumber: '' },
  emergencyContact: [{ name: 'QA EC', phoneNumber: phone(), countryCode: '+61' }], familyDetails: null, callSecurityNumber: '', callSecurityNumberId: sec?._id ?? '', app: 'secure',
  standardOperatingProcedure: 'QA SOP', sendSms: false, sendEmail: false, currentCity: null, entityId: entity._id }, ROLE);
const clientId = client.body?.data?._id;
try {
  if (!clientId) throw new Error(`client not created: ${client.status} ${client.body?.message}`);
  const apiCity = (await api('GET', `/admin/client/${clientId}`, null, ROLE)).body?.data?.currentCity;
  await page.goto(`${CMS}/clients/${clientId}/view`); await page.waitForTimeout(6000);
  const s3 = await shot('ES1SPGSLV-775_client-location');
  record('Client location saved as Exmouth-WA (ES1SPGSLV-775 regression)', /exmouth/i.test(String(apiCity)), `currentCity sent: null → saved: "${apiCity}"`, [s3]);
} catch (e) { record('Client location saved as Exmouth-WA (ES1SPGSLV-775 regression)', null, e.message, []); }

// 4) Alert group form: "Add New Monitoring Center" list is empty (SPG-BUG-10)
const mcTotal = (await api('GET', '/admin/monitoring-center?currentPage=1&pageSize=1')).body.data.totalDocs;
const mcCalls = [];
page.on('response', async (r) => { if (r.url().includes('/monitoring-center/dropdown/min')) mcCalls.push((await r.json().catch(() => ({})))?.data?.length ?? -1); });
let pickerOpened = true;
await page.goto(`${CMS}/alert-groups/${entity._id}/add`); await page.waitForTimeout(5000);
try { await page.getByRole('button', { name: /Add New Monitoring Cent/i }).click(); await page.waitForTimeout(4000); }
catch (e) { pickerOpened = false; console.warn('Monitoring centre picker:', e.message); }
const s4 = await shot('BUG-10_alert-group_monitoring-centre-picker');
record('SPG-BUG-10 monitoring centre picker empty', !pickerOpened || mcCalls.length === 0 ? null : mcTotal > 0 && mcCalls.every((n) => n === 0),
  `centres that exist: ${mcTotal}; items the picker received: ${JSON.stringify(mcCalls)}`, [s4]);

// 5) Entity context (Login on behalf): Entity Admins rows have no Delete action (SPG-BUG-23). Read-only check.
const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await ctx2.addInitScript(([t, id, name]) => {
  localStorage.setItem('serviceToken', t);
  sessionStorage.setItem('roles', 'entityPrincipalAdmin'); sessionStorage.setItem('entityId', id); sessionStorage.setItem('entityName', name);
}, [token, entity._id, entity.entityName ?? entity.name ?? '']);
const page2 = await ctx2.newPage();
await page2.goto(`${CMS}/dashboard?entityId=${entity._id}`); await page2.waitForTimeout(5000);
await page2.goto(`${CMS}/users`); await page2.waitForTimeout(7000);
const rows = page2.locator('table tbody tr');
const nRows = await rows.count();
const actionButtons = nRows ? await rows.first().locator('td').last().locator('button, svg, a').count() : 0;
const deleteButtons = nRows ? await rows.first().locator('[data-testid="DeleteIcon"], [aria-label*="elete" i], [title*="elete" i]').count() : 0;
const s5 = `${OUT}/BUG-23_entity-admins_no-delete.png`; await page2.screenshot({ path: s5, fullPage: true });
record('SPG-BUG-23 no Delete for entity admins in the CMS', nRows ? deleteButtons === 0 : null, `rows: ${nRows}; action icons in first row: ${actionButtons}; delete icons: ${deleteButtons}`, [s5]);

await browser.close();
if (clientId) await api('DELETE', `/admin/client/delete/${clientId}`, null, ROLE);   // clients CAN be deleted
fs.writeFileSync(`${OUT}/results.json`, JSON.stringify(results, null, 2));
console.log(`Screenshots and results in ${OUT}/`);
