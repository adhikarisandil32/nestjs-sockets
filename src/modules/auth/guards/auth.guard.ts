import {
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { USER_ROLE } from 'src/modules/users/constants/user.constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(
    err: Error,
    user: { id: number; role: USER_ROLE },
    info: Error,
  ): any {
    try {
      if (err || !user || !user?.id || !user?.role) {
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Not Authorized!',
          _error: err ? err?.message : info?.message,
        });
      }
      return user;
    } catch (error) {
      // console.log('Error in ', AuthJwtAccessGuard.name, ' ', error);
      throw error;
    }
  }
}
