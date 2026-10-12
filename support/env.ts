import 'dotenv/config';

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}. Copy .env.example to .env and fill it in.`);
  return v;
}

export const env = {
  apiUrl: process.env.SPG_API_URL ?? 'https://stageapi.red.global/v1',
  cmsUrl: process.env.SPG_CMS_URL ?? 'https://stagecms.red.global',
  get adminEmail() { return required('SPG_ADMIN_EMAIL'); },
  get adminPassword() { return required('SPG_ADMIN_PASSWORD'); },
  awsRegion: process.env.SPG_AWS_REGION ?? 'ap-southeast-2',
  get cognitoPoolId() { return required('SPG_COGNITO_POOL_ID'); },
  get s3Bucket() { return required('SPG_S3_BUCKET'); },
  sessionFile: '.auth/session.json',
};
