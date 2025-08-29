import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/auth.guard';

export function UserProtected() {
  const decorators: any[] = [JwtAuthGuard];

  return applyDecorators(UseGuards(...decorators));
}
