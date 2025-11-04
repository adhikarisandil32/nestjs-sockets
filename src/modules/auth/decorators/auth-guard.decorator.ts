import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/auth.guard';
import { PutAdminToRequest, PutUserToRequest } from '../guards/put-user.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export function UserProtected() {
  const decorators: any[] = [JwtAuthGuard, PutUserToRequest];

  return applyDecorators(ApiBearerAuth(), UseGuards(...decorators));
}

export function AdminProtected() {
  const decorators: any[] = [JwtAuthGuard, PutAdminToRequest];

  return applyDecorators(ApiBearerAuth(), UseGuards(...decorators));
}
