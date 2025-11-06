import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { IDbConfig } from '../configs/service-configs/database.config';
// const path = require('path')

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        // console.log(path.resolve(__dirname + './../../**/*.entity{.ts,.js}'))

        const dbConfig = configService.get<IDbConfig>('database');

        return {
          type: dbConfig?.type,
          database: dbConfig?.name,
          username: dbConfig?.username,
          password: dbConfig?.password,
          host: dbConfig?.host,
          port: dbConfig?.port,
          synchronize: dbConfig?.synchronize,
          entities: [__dirname + './../../**/*.entity{.ts,.js}'],
          migrations: [__dirname + './../../migrations/*{.ts,.js}'],
          logging: ['query'], // log sql queries executed
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
