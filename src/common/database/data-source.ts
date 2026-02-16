import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource: DataSource = new DataSource({
  type: 'postgres',
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT!,
  entities: [__dirname + './../../**/*.entity{.ts,.js}'],
  migrations: [__dirname + './../../migrations/*{.ts,.js}'],
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  // subscribers: [__dirname + './../../**/*.subscriber{.ts,.js'],
  // subscribers: [GroupSubscriber],
});
