import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT_CONNECTION } from '../redis.constant';
import type { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT_CONNECTION) private readonly redis: RedisClientType,
  ) {}

  async get(key: string) {
    const value = await this.redis.get(key);
    return value;
  }

  async set(key: string, value: any, options?: Record<string, any>) {
    await this.redis.set(key, value, options);
  }

  async delete(key: string) {
    if (await this.keyExists(key)) {
      await this.redis.del(key);
    }
  }

  async keyExists(key: string) {
    return !!(await this.redis.get(key));
  }

  // returns the value of the field in the key
  async hGet(key: string, field: string) {
    const value = await this.redis.hGet(key, field);
    return value;
  }

  async hSet(
    key: string,
    fields: Record<string, string | number>,
    ttl?: number | null,
  ) {
    const result = await this.redis.hSet(key, fields);

    if (ttl) {
      await this.redis.expire(key, ttl);
    }

    return result;
  }

  // returns all value of the fields in the key
  async hmGet(key: string, fields: string[]) {
    const results = await this.redis.hmGet(key, fields);
    return results.map((result) => result || null);
  }

  // deletes the individual field of the key
  async hDelete(key: string, field: string) {
    if (await this.keyExists(key)) {
      await this.redis.hDel(key, field);
    }
  }
}
