import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  port: isNaN(Number(process.env.REDIS_PORT))
    ? 6379
    : Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST ?? 'localhost',
  password: process.env.REDIS_PASSWORD ?? '',
}));
