import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT_CONNECTION } from '../redis.constant';
import type { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT_CONNECTION) private readonly redis: RedisClientType,
  ) {}

  async getValue(key: string) {
    const value = await this.redis.get(key);

    return value;
  }

  async setValue(key: string, value: any) {
    console.log({ key, value });
    const result = await this.redis.set(key, value);

    return result;
  }
}
