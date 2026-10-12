#!/usr/bin/env node
// Lists step definitions that no .feature file uses (works with this repo's two BDD configs).
// Usage: npm run steps:unused
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const steps = execSync('npx bddgen export', { encoding: 'utf8' })
  .split('\n').filter((l) => l.startsWith('* ')).map((l) => l.slice(2).trim());
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.feature') ? [path.join(d, e.name)] : []);
const lines = walk('features').flatMap((f) => fs.readFileSync(f, 'utf8').split('\n'))
  .map((l) => l.match(/^\s*(Given|When|Then|And|But)\s+(.*)$/)?.[2]?.trim()).filter(Boolean);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const toRegex = (t) => t.startsWith('^') ? new RegExp(t)
  : new RegExp('^' + esc(t).replace(/\\\{string\\\}/g, '"[^"]*"').replace(/\\\{int\\\}/g, '-?\\d+') + '$');
const unused = steps.filter((s) => { const t = s.split(' ').slice(1).join(' '); return !lines.some((l) => toRegex(t).test(l)); });
console.log(`${steps.length} step definitions, ${lines.length} Gherkin lines.`);
console.log(unused.length ? `Unused:\n- ${unused.join('\n- ')}` : 'No unused steps.');
process.exit(unused.length ? 1 : 0);
