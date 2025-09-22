import { UsersService } from 'src/modules/users/services/users.service';
import { LoginAuthDto } from '../dtos/login.auth.dto';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { IJwtUser } from '../interfaces/jwt.interface';

@Injectable()
export class AuthService {
  private readonly secretKey: string;

  constructor(
    private readonly _usersService: UsersService,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
  ) {
    this.secretKey = this._configService.get<string>('jwt.secretKey')!;
  }

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

    return {
      accessToken: this._jwtService.sign(
        { id: existingUser.id, role: existingUser.role },
        { secret: this.secretKey },
      ),
    };
  }

  async getMe(user: IJwtUser): Promise<UserEntity> {
    const userInDb = await this._usersService.findOneById(user.id);

    if (!userInDb) {
      throw new UnauthorizedException('no token available');
    }

    return userInDb;
  }
}
