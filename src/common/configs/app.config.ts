import { registerAs } from '@nestjs/config';

export enum APP_MODE {
  DEV = 'development',
  PROD = 'production',
}

export default registerAs('app', () => ({
  mode: process.env.NODE_ENV,
  port: isNaN(Number(process.env.PORT)) ? 3000 : parseInt(process.env.PORT!),
}));
