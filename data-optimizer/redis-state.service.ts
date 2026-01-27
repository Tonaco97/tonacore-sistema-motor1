import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisStateService {
  private redis = new Redis(process.env.REDIS_URL);

  async saveState(key: string, value: any) {
    await this.redis.set(key, JSON.stringify(value));
  }

  async loadState(key: string) {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }
}