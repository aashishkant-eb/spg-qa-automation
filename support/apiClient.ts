import fs from 'node:fs';
import path from 'node:path';
import type { APIRequestContext, APIResponse } from '@playwright/test';
import { env } from './env';

export type ApiResult = { status: number; body: any; ms: number; method: string; path: string };

/** Logs in and stores the token where every worker and the UI tests can read it. */
export async function loginAndSaveSession(request: APIRequestContext): Promise<string> {
  const res = await request.post(`${env.apiUrl}/admin/auth/login`, { data: { email: env.adminEmail, password: env.adminPassword } });
  const body = await res.json().catch(() => ({}));
  if (res.status() !== 200) throw new Error(`Login failed: HTTP ${res.status()} ${body?.message ?? ''}`);
  const token: string = body.data.token.accessToken;
  fs.mkdirSync(path.dirname(env.sessionFile), { recursive: true });
  fs.writeFileSync(env.sessionFile, JSON.stringify({ token, userId: body.data.data._id }), { mode: 0o600 });
  return token;
}

export function readSession(): { token: string; userId: string } {
  return JSON.parse(fs.readFileSync(env.sessionFile, 'utf8'));
}

const OUTAGE_LOG = 'reports/staging-outages.log';

/**
 * Staging sometimes restarts for a few seconds (nginx 502), e.g. after emergency actions (SPG-BUG-24).
 * Wait and retry for up to 60 s so one outage does not break the run – and write every outage to
 * reports/staging-outages.log so the sprint report shows it. Never hidden, never retried forever.
 */
async function sendSurvivingOutage(send: () => Promise<APIResponse>, label: string): Promise<APIResponse> {
  let res = await send();
  const started = Date.now();
  let tries = 0;
  while ([502, 503, 504].includes(res.status()) && Date.now() - started < 60_000) {
    tries++;
    await new Promise((r) => setTimeout(r, 5_000));
    res = await send();
  }
  if (tries > 0) {
    const line = `${new Date().toISOString()}  HTTP 502/503/504 on ${label} – ${res.status() < 500 ? 'recovered' : 'STILL DOWN'} after ${Math.round((Date.now() - started) / 1000)} s (${tries} retries)`;
    console.warn(`[staging-outage] ${line}`);
    fs.mkdirSync(path.dirname(OUTAGE_LOG), { recursive: true });
    fs.appendFileSync(OUTAGE_LOG, line + '\n');
  }
  return res;
}

/**
 * Thin SPG API client. SPG keeps one session per account, so a 401 "Invalid Token!"
 * means someone logged in elsewhere: log in once more and retry the request.
 */
export class SpgApi {
  constructor(private request: APIRequestContext) {}

  get token() { return readSession().token; }

  async call(method: string, apiPath: string, opts: { data?: unknown; auth?: boolean; role?: string } = {}): Promise<ApiResult> {
    const send = async (): Promise<APIResponse> => {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (opts.auth !== false) headers.Authorization = `Bearer ${this.token}`;
      if (opts.role) headers['x-effective-role'] = opts.role;
      return this.request.fetch(`${env.apiUrl}${apiPath}`, { method, headers, data: opts.data as any, failOnStatusCode: false });
    };
    const t0 = Date.now();
    let res = await sendSurvivingOutage(send, `${method} ${apiPath}`);
    if (res.status() === 401 && opts.auth !== false && /invalid token/i.test(await res.text())) {
      await loginAndSaveSession(this.request);
      res = await sendSurvivingOutage(send, `${method} ${apiPath}`);
    }
    const text = await res.text();
    let body: any = text;
    try { body = JSON.parse(text); } catch { /* non-JSON (e.g. nginx 502 page) stays as text */ }
    return { status: res.status(), body, ms: Date.now() - t0, method, path: apiPath };
  }

  get(p: string, o: { auth?: boolean; role?: string } = {}) { return this.call('GET', p, o); }
  post(p: string, data: unknown, o: { auth?: boolean; role?: string } = {}) { return this.call('POST', p, { ...o, data }); }
  patch(p: string, data: unknown, o: { role?: string } = {}) { return this.call('PATCH', p, { ...o, data }); }
  delete(p: string, o: { role?: string } = {}) { return this.call('DELETE', p, o); }
}
