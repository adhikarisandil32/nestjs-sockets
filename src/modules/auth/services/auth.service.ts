import { UsersService } from 'src/modules/users/services/users.service';
import { DataSource } from 'typeorm';
import { LoginAuthDto } from '../dtos/login.auth.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _dataSource: DataSource,
  ) {}

  async login(credentials: LoginAuthDto) {
    const existingUser = await this._usersService.findOneByEmail({
      email: credentials.email,
    });

    if (!existingUser) {
      throw new NotFoundException('email or password did not match');
    }

    const passwordMatch = await bcrypt.compare(
      credentials.password,
      existingUser.password,
    );

    if (!passwordMatch) {
      throw new NotFoundException('email or password did not match');
    }

    return existingUser;
  }
}
