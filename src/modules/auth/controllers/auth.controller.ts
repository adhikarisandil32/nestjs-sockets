import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginAuthDto } from '../dtos/login.auth.dto';
import { AuthGuard } from '../decorators/auth-guard.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AuthGuard()
  @Post('login')
  async login(@Body() credentials: LoginAuthDto) {
    return await this.authService.login(credentials);
  }
}
