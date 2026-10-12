// Renders docs/guide/guide.html to a PDF with Playwright's Chromium (no extra tools needed on Linux).
// Usage: node docs/guide/build-pdf.mjs [output.pdf]
import { chromium } from '@playwright/test';
import path from 'node:path';
const out = process.argv[2] ?? 'docs/SPG_QA_How_Everything_Works.pdf';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file://' + path.resolve('docs/guide/guide.html'));
await page.pdf({
  path: out, format: 'A4', printBackground: true, displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate: '<div style="font-size:8px;width:100%;text-align:center;color:#5b6573">SPG QA Package – How Everything Works · page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
  margin: { top: '16mm', bottom: '18mm', left: '15mm', right: '15mm' },
});
await browser.close();
console.log('PDF written to', out);
