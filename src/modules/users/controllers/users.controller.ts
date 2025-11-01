import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { USER_ROLE } from '../constants/user.constant';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async getAllUsers(@Body() createUserDto: CreateUserDto) {
    createUserDto.role = USER_ROLE.USER;

    return await this.usersService.createUser(createUserDto);
  }
}
