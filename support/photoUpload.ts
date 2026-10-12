import fs from 'node:fs';
import path from 'node:path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { env } from './env';

/**
 * Uploads a picture the same way the CMS does (Cognito identity → S3) and returns the S3 key
 * that the API stores in profilePhoto / entityLogo / monitoringCentreLogo.
 */
export async function uploadPhoto(fileName: string): Promise<string> {
  const filePath = path.resolve('test-data', fileName);
  const s3 = new S3Client({
    region: env.awsRegion,
    credentials: fromCognitoIdentityPool({ clientConfig: { region: env.awsRegion }, identityPoolId: env.cognitoPoolId }),
  });
  const key = `admin/qa-automation/${Date.now()}-${path.basename(fileName)}`;
  try {
    await s3.send(new PutObjectCommand({ Bucket: env.s3Bucket, Key: key, Body: fs.readFileSync(filePath), ContentType: contentType(fileName), ACL: 'private' }));
  } catch (e) {
    throw new Error(`Photo upload to S3 failed: ${(e as Error).name}: ${(e as Error).message}\n${hint(e as Error & { code?: string })}`);
  }
  return key;
}

// Photo tests are the only ones that talk to AWS directly, so a new PC usually fails here first.
function hint(e: Error & { code?: string }) {
  const t = `${e.name} ${e.code ?? ''} ${e.message}`;
  if (/Skew|Signature|expired|not yet valid/i.test(t)) return 'Likely cause: the computer clock is wrong (AWS allows 5 minutes). WSL: run `wsl --shutdown` in Windows, or check with `npm run doctor`.';
  if (/ENOTFOUND|ETIMEDOUT|ECONNREFUSED|ECONNRESET|EAI_AGAIN|socket|network|proxy/i.test(t)) return 'Likely cause: the network blocks AWS (office firewall / proxy / VPN). Try another network, or ask IT to allow *.amazonaws.com. Check with `npm run doctor`.';
  if (/AccessDenied|NotAuthorized|Forbidden|Unauthenticated/i.test(t)) return 'Likely cause: anonymous upload to the photo bucket was closed (maybe SPG-BUG-28 was fixed) – the test needs the new upload flow. Tell the QA lead.';
  return 'Run `npm run doctor` to find the cause.';
}

function contentType(f: string) {
  const ext = path.extname(f).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  throw new Error(`Unsupported photo type ${ext} – the CMS accepts JPEG and PNG only`);
}
