import { test as base, createBdd } from 'playwright-bdd';
import { SpgApi, ApiResult } from '../support/apiClient';

/** Data shared between the steps of ONE scenario. */
export class World {
  last?: ApiResult;                       // last API response
  ids: Record<string, string> = {};       // e.g. ids.supportStaff, ids.entity
  bodies: Record<string, any> = {};       // request bodies sent at create time (PATCH needs the full object)
  photoKey?: string;                      // S3 key of the photo uploaded in this scenario
}

type Cleanup = { add: (label: string, fn: () => Promise<unknown>) => void };

export const test = base.extend<{ api: SpgApi; world: World; cleanup: Cleanup }>({
  api: async ({ request }, use) => use(new SpgApi(request)),
  world: async ({}, use) => use(new World()),
  // Deletes everything the scenario created – also when the scenario fails.
  cleanup: async ({}, use, testInfo) => {
    const jobs: { label: string; fn: () => Promise<unknown> }[] = [];
    await use({ add: (label, fn) => jobs.push({ label, fn }) });
    for (const job of jobs.reverse()) {
      try {
        await job.fn();
      } catch (e) {
        const msg = `Cleanup failed for ${job.label}: ${(e as Error).message}`;
        console.error(msg);
        testInfo.annotations.push({ type: 'cleanup-failed', description: msg });
      }
    }
  },
});

export const { Given, When, Then, Before, After } = createBdd(test);
