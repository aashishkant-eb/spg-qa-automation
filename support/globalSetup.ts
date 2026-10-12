import fs from 'node:fs';
import { request } from '@playwright/test';
import { loginAndSaveSession } from './apiClient';

// Runs once before all tests: one login, shared by every scenario (API and UI).
export default async function globalSetup() {
  fs.rmSync('reports/staging-outages.log', { force: true });
  const ctx = await request.newContext();
  try {
    await loginAndSaveSession(ctx);
  } finally {
    await ctx.dispose();
  }
}
