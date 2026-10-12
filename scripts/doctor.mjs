#!/usr/bin/env node
// Checks a PC is ready to run the SPG tests and says how to fix what is not. Safe: it does NOT log in
// (a login would end your other SPG sessions) and only uploads one small test photo, like the photo tests do.
// Usage: npm run doctor
import 'dotenv/config';
import fs from 'node:fs';

const results = [];
const check = async (name, fn) => {
  try { const detail = await fn(); results.push(['OK  ', name, detail ?? '']); }
  catch (e) { results.push(['FAIL', name, e.message]); }
};
const fail = (msg) => { throw new Error(msg); };

await check('Node.js 18+', () => {
  const major = Number(process.versions.node.split('.')[0]);
  return major >= 18 ? `v${process.versions.node}` : fail(`v${process.versions.node} is too old – nvm install 22`);
});

await check('.env settings', () => {
  if (!fs.existsSync('.env')) fail('No .env – run: cp .env.example .env, then set SPG_ADMIN_PASSWORD');
  const missing = ['SPG_API_URL', 'SPG_CMS_URL', 'SPG_ADMIN_EMAIL', 'SPG_ADMIN_PASSWORD', 'SPG_AWS_REGION', 'SPG_COGNITO_POOL_ID', 'SPG_S3_BUCKET'].filter((k) => !process.env[k]);
  return missing.length ? fail(`Missing in .env: ${missing.join(', ')}`) : 'all set';
});

await check('Test photo file', () => (fs.existsSync('test-data/qa-photo.png') ? 'test-data/qa-photo.png' : fail('test-data/qa-photo.png is missing – unzip the package again')));

await check('Browser starts (headless)', async () => {
  const { chromium } = await import('@playwright/test');
  const channel = process.env.PW_CHANNEL || undefined;
  const b = await chromium.launch({ channel }).catch((e) => fail(`${e.message.split('\n')[0]} – run: npx playwright install chromium, or set PW_CHANNEL=chrome in .env`));
  await b.close();
  return channel ? `using installed ${channel}` : 'Playwright Chromium';
});

await check('Screen for --headed runs', () => {
  if (process.env.DISPLAY || process.env.WAYLAND_DISPLAY) return `display ${process.env.DISPLAY || process.env.WAYLAND_DISPLAY}`;
  fail('No display found – headed mode cannot open a window here. Headless runs still work. On WSL use Windows 11 (WSLg); over SSH there is no screen.');
});

let serverDate;
await check('SPG API reachable', async () => {
  const t = Date.now();
  const r = await fetch(process.env.SPG_API_URL ?? 'https://stageapi.red.global/v1').catch((e) => fail(`${e.cause?.code ?? e.message} – network/VPN/proxy blocks stageapi.red.global`));
  serverDate = r.headers.get('date');
  return `HTTP ${r.status} in ${Date.now() - t} ms`;
});

await check('Computer clock', () => {
  if (!serverDate) fail('Could not read the server time (API not reachable)');
  const skew = Math.round((Date.now() - new Date(serverDate).getTime()) / 1000);
  if (Math.abs(skew) > 240) fail(`Clock is ${skew > 0 ? 'ahead' : 'behind'} by ${Math.abs(skew)} s – AWS photo uploads fail above 5 min. WSL: run "wsl --shutdown" in Windows and reopen; else fix the system time.`);
  return `${skew} s difference from the server`;
});

let creds;
await check('AWS Cognito (photo credentials)', async () => {
  const { fromCognitoIdentityPool } = await import('@aws-sdk/credential-providers');
  const provider = fromCognitoIdentityPool({ clientConfig: { region: process.env.SPG_AWS_REGION }, identityPoolId: process.env.SPG_COGNITO_POOL_ID });
  await provider().catch((e) => fail(`${e.name}: ${e.message} – network blocks cognito-identity.${process.env.SPG_AWS_REGION}.amazonaws.com, or the pool changed`));
  creds = provider;   // only after it worked, so the S3 check can say "skipped" instead of blaming S3
  return 'credentials received';
});

await check('AWS S3 photo upload', async () => {
  if (!creds) fail('skipped – Cognito failed');
  const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
  const s3 = new S3Client({ region: process.env.SPG_AWS_REGION, credentials: creds });
  const key = `admin/qa-automation/doctor-${Date.now()}.png`;
  await s3.send(new PutObjectCommand({ Bucket: process.env.SPG_S3_BUCKET, Key: key, Body: fs.readFileSync('test-data/qa-photo.png'), ContentType: 'image/png', ACL: 'private' }))
    .catch((e) => fail(`${e.name}: ${e.message} – ${/Access|Forbidden/i.test(e.name + e.message) ? 'bucket no longer allows anonymous upload (SPG-BUG-28 fixed?) – tell the QA lead' : 'network blocks *.s3.amazonaws.com or clock is wrong'}`));
  return 'upload works';
});

console.log('\nSPG test PC check\n');
for (const [s, n, d] of results) console.log(`${s === 'OK  ' ? '✅' : '❌'} ${n.padEnd(34)} ${d}`);
const bad = results.filter((r) => r[0] === 'FAIL');
console.log(bad.length ? `\n${bad.length} problem(s) – fix the ❌ lines above, then run npm run doctor again.` : '\nAll good – run: npm run test:smoke');
process.exit(bad.some((r) => r[1] !== 'Screen for --headed runs') ? 1 : 0);
