import { Controller, Get } from '@nestjs/common';
import { UserProtected } from 'src/modules/auth/decorators/auth-guard.decorator';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UserProtected()
  @Get('all')
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }
}
