import {
  Injectable, CanActivate, ExecutionContext, TooManyRequestsException
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class SecureIngestionGuard implements CanActivate {
  private redis = new Redis(process.env.REDIS_URL);

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const tenant = req.headers['x-tenant-id'];

    if (!tenant) return false;

    const key = `ratelimit:${tenant}`;
    const count = await this.redis.incr(key);

    if (count === 1) {
      await this.redis.expire(key, 1);
    }

    if (count > Number(process.env.TENANT_RPS || 1000)) {
      throw new TooManyRequestsException();
    }

    return true;
  }
}