
import { CanActivate, ExecutionContext, Injectable, TooManyRequestsException } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class SecureGuard implements CanActivate {
  private redis = new Redis(process.env.REDIS_URL);

  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const tenant = req.headers['x-tenant-id'];
    const key = `rl:${tenant}`;
    const count = await this.redis.incr(key);
    if (count === 1) await this.redis.expire(key, 1);
    if (count > Number(process.env.TENANT_RPS || 1000)) {
      throw new TooManyRequestsException();
    }
    return true;
  }
}
