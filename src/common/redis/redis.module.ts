import { Module } from '@nestjs/common';
import { REDIS_CLIENT_CONNECTION } from './redis.constant';
import { createClient } from 'redis';

@Module({
  imports: [],
  providers: [
    {
      provide: REDIS_CLIENT_CONNECTION,
      useFactory: async () => {
        const client = createClient({});

        await client.connect();
        return client;
      },
    },
  ],
  exports: [],
})
export class RedisModule {}
