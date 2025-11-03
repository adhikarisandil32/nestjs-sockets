import { registerAs } from '@nestjs/config';

export default registerAs('aws', () => ({
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  bucketName: process.env.MINIO_BUCKET_NAME,
  assetUrl: process.env.MINIO_ASSET_URL,
  region: process.env.MINIO_REGION,
  endpoint: process.env.MINIO_ENDPOINT,
}));
