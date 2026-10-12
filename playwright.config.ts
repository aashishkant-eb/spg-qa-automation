import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';

// Scenarios with these tags never run unless asked for explicitly (QA guide: @wip; known bugs use @fail instead).
// @creates-data = scenarios that leave records SPG cannot delete (no delete for entities, field operatives,
// support staff or entity users). Run them on purpose only: npm run test:creates-data
// They stay excluded even when TAGS is given (CI, `TAGS='@photo' npm test`) unless TAGS names them explicitly.
const userTags = process.env.TAGS?.trim();
const guards = ['@wip', '@manual', '@creates-data'].filter((t) => !userTags?.includes(t)).map((t) => `not ${t}`);
const DEFAULT_TAGS = [userTags && `(${userTags})`, ...guards].filter(Boolean).join(' and ');

const apiTestDir = defineBddConfig({
  outputDir: '.features-gen/api',
  features: 'features/api/**/*.feature',
  steps: ['steps/fixtures.ts', 'steps/common.steps.ts', 'steps/setup.steps.ts', 'steps/api/*.steps.ts'],
  tags: DEFAULT_TAGS,
  missingSteps: 'fail-on-gen',
});

const uiTestDir = defineBddConfig({
  outputDir: '.features-gen/ui',
  features: 'features/ui/**/*.feature',
  steps: ['steps/fixtures.ts', 'steps/common.steps.ts', 'steps/setup.steps.ts', 'steps/ui/*.steps.ts'],
  tags: DEFAULT_TAGS,
  missingSteps: 'fail-on-gen',
});

export default defineConfig({
  // SPG allows ONE session per account: parallel workers would log each other out ("Invalid Token!").
  workers: 1,
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  timeout: 120_000,
  expect: { timeout: 10_000 },
  globalSetup: './support/globalSetup.ts',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-html', open: 'never' }],
    cucumberReporter('html', { outputFile: 'reports/cucumber-report.html' }),
    cucumberReporter('json', { outputFile: 'reports/cucumber-report.json' }),
    ['junit', { outputFile: 'reports/junit.xml' }],
  ],
  use: {
    baseURL: process.env.SPG_CMS_URL ?? 'https://stagecms.red.global',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'api', testDir: apiTestDir },
    {
      name: 'ui',
      testDir: uiTestDir,
      // PW_CHANNEL=chrome uses the Google Chrome already on the PC – for machines where the bundled
      // Chromium can't start because Linux libraries are missing and there is no sudo to install them.
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 1000 },
        channel: process.env.PW_CHANNEL || undefined,
        // SLOWMO=500 waits 500 ms between browser actions so a headed run can be followed by eye.
        launchOptions: { slowMo: Number(process.env.SLOWMO ?? 0) },
      },
    },
  ],
});
