import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { IDbConfig } from '../configs/database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const dbConfig = configService.get<IDbConfig>('database');

        return {
          type: dbConfig?.type,
          database: dbConfig?.name,
          username: dbConfig?.username,
          password: dbConfig?.password,
          host: dbConfig?.host,
          port: dbConfig?.port,
          synchronize: dbConfig?.synchronize,
          entities: [__dirname + '/**/*.entity.{js,ts}'],
          migrations: [__dirname + '/migrations/*.{js,ts}'],
        };
      },
      dataSourceFactory: async (options: DataSourceOptions) => {
        const dataSource = await new DataSource(options).initialize();

        return dataSource;
      },
    }),
  ],
  exports: [],
})
export class DatabaseModule {}
