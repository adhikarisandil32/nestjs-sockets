import { Logger, Module } from '@nestjs/common';
import { REDIS_CLIENT_CONNECTION } from './redis.constant';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  providers: [
    {
      provide: REDIS_CLIENT_CONNECTION,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const client = createClient({
          password: configService.get<string>('redis.password'),
          socket: {
            host: configService.get<string>('redis.host'),
            port: configService.get<number>('redis.port'),
          },
        });

        const logger = new Logger(RedisModule.name);

        client.on('error', (err) => {
          logger.error('cannot connect redis');
          console.log(err);
        });

        client.on('connect', () => logger.log('redis connection success'));

        await client.connect();
        return client;
      },
    },
  ],
  exports: [REDIS_CLIENT_CONNECTION],
})
export class RedisModule {}
