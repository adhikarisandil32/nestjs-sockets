import { registerAs } from '@nestjs/config';
import { DatabaseType } from 'typeorm';

export interface IDbConfig {
  type: Extract<DatabaseType, 'postgres'>;
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  synchronize: boolean;
}

export default registerAs(
  'database',
  (): Partial<IDbConfig> => ({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: isNaN(Number(process.env.DATABASE_PORT))
      ? 5432
      : Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  }),
);
