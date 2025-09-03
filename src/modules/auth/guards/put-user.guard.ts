import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Request as IRequest } from 'express';
import { IJwtUser } from '../interfaces/jwt.interface';
import { UsersService } from 'src/modules/users/services/users.service';
import { UserEntity } from 'src/modules/users/entities/user.entity';

interface IUser {
  user: IJwtUser;
  __user: UserEntity;
}

export class PutUserToRequest implements CanActivate {
  constructor(@Inject() private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<IRequest & IUser>();
      const requestUser = request.user;

      if (requestUser && !requestUser.id) {
        throw new UnauthorizedException('user unauthorized');
      }

      const user = await this.userService.findOneById(requestUser.id);

      if (!user) {
        throw new UnauthorizedException('user unauthorized');
      }

      request.__user = user;

      return true;
    } catch (error) {
      throw error;
    }
  }
}
