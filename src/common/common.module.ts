import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './configs/config.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
        },
      },
    }),
  ],
  exports: [],
})
export class CommonModule {}
