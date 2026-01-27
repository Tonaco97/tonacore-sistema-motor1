import { CanActivate, ExecutionContext, Injectable, TooManyRequestsException } from '@nestjs/common';

@Injectable()
export class SecureGuard implements CanActivate {
  private readonly limit = 1000;
  private counter = new Map<string, number>();

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const tenant = request.headers['x-tenant-id'] || 'default';

    const count = (this.counter.get(tenant) || 0) + 1;
    this.counter.set(tenant, count);

    if (count > this.limit) {
      throw new TooManyRequestsException();
    }

    return true;
  }
}
