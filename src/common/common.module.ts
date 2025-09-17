import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './configs/config.module';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { ResponseModule } from './response/response.module';
import { ErrorFilterModule } from './error/error.module';
// import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule,
    ErrorFilterModule,
    DatabaseModule,
    ResponseModule,
    PinoLoggerModule.forRoot({
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
