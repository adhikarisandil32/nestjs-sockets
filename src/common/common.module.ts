import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './configs/config.module';
import { ResponseModule } from './response/response.module';
import { ErrorFilterModule } from './error/error.module';
import { AwsModule } from './aws/aws.module';
import { AppBullModule } from './bullmq/bullmq.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule,
    ErrorFilterModule,
    DatabaseModule,
    ResponseModule,
    AwsModule,
    AppBullModule,
    RedisModule,
  ],
  exports: [],
})
export class CommonModule {}
