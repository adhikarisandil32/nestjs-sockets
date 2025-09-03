import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/auth.guard';
import { PutUserToRequest } from '../guards/put-user.guard';

export function UserProtected() {
  const decorators: any[] = [JwtAuthGuard, PutUserToRequest];

  return applyDecorators(UseGuards(...decorators));
}
