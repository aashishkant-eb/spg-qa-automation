#!/usr/bin/env node
// Builds the "Sprint-wise Automation Report" (QA guide §Automation → Project Delivery) as Markdown
// from reports/cucumber-report.json. Paste the output into Coda or Outline.
// Usage: node scripts/sprint-report.mjs "Sprint 7" [path/to/cucumber-report.json]
import fs from 'node:fs';

const sprint = process.argv[2] ?? 'Sprint';
const file = process.argv[3] ?? 'reports/cucumber-report.json';
if (!fs.existsSync(file)) {
  console.error(`No results at ${file}. Run "npm test" first.`);
  process.exit(1);
}
const features = JSON.parse(fs.readFileSync(file, 'utf8'));

const rows = [];
for (const f of features) {
  for (const s of f.elements ?? []) {
    if (s.type === 'background') continue;
    const tags = (s.tags ?? []).map((t) => t.name);
    const steps = (s.steps ?? []).map((st) => st.result?.status ?? 'unknown');
    const failed = steps.includes('failed');
    const skipped = !failed && steps.every((x) => x === 'skipped' || x === 'pending' || x === 'undefined');
    const knownBug = tags.find((t) => /^@SPG-BUG-\d+/.test(t));
    const expectedToFail = tags.includes('@fail');
    let status;
    if (expectedToFail) status = failed ? '🟠 Known bug – still open' : '🟢 Known bug – looks FIXED (remove @fail and re-check)';
    else status = failed ? '🔴 Failed' : skipped ? '⚪ Skipped' : '🟢 Passed';
    rows.push({ feature: f.name, scenario: s.name, status, tc: tags.find((t) => /^@TC-/.test(t))?.slice(1) ?? '', bug: knownBug?.slice(1) ?? '' });
  }
}

const count = (p) => rows.filter((r) => r.status.startsWith(p)).length;
const failedRows = rows.filter((r) => r.status.startsWith('🔴'));
const esc = (s) => String(s).replace(/\|/g, '\\|');
const outages = fs.existsSync('reports/staging-outages.log') ? fs.readFileSync('reports/staging-outages.log', 'utf8').trim().split('\n').filter(Boolean) : [];
const outageText = outages.length
  ? `## ⚠️ Staging went down during this run (${outages.length}×)\n\nThe suite waited and retried, so results are still valid. Likely SPG-BUG-24 – report it.\n\n${outages.map((o) => `- ${o}`).join('\n')}\n\n`
  : '';
const out = `# ${sprint} – Automation Report

**Date:** ${new Date().toISOString().slice(0, 10)} · **Environment:** ${process.env.SPG_API_URL ?? 'staging'} · **Scenarios:** ${rows.length}

| 🟢 Passed | 🔴 Failed | 🟠 Known bugs open | 🟢 Known bugs fixed? | ⚪ Skipped |
|---|---|---|---|---|
| ${count('🟢 Passed')} | ${count('🔴')} | ${count('🟠')} | ${count('🟢 Known')} | ${count('⚪')} |

${outageText}${failedRows.length ? `## 🔴 New failures – log in Jira\n\n${failedRows.map((r) => `- **${esc(r.feature)}** – ${esc(r.scenario)} ${r.tc ? `(${r.tc})` : ''}`).join('\n')}\n` : '## ✅ No new failures\n'}
## All scenarios

| Feature | Scenario | Test case | Bug | Result |
|---|---|---|---|---|
${rows.map((r) => `| ${esc(r.feature)} | ${esc(r.scenario)} | ${r.tc} | ${r.bug} | ${r.status} |`).join('\n')}

> Full report with screenshots and traces: \`npm run report\` (reports/playwright-html) and reports/cucumber-report.html.
`;
fs.mkdirSync('reports', { recursive: true });
fs.writeFileSync('reports/sprint-automation-report.md', out);
console.log(out);
process.exit(failedRows.length ? 1 : 0);
