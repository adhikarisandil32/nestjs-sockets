import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './configs/config.module';
import { LoggerModule } from 'nestjs-pino';
import { ResponseModule } from './response/response.module';
// import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    ResponseModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
        },
      },
    }),
    // HealthModule,
  ],
  exports: [],
})
export class CommonModule {}
