import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginAuthDto } from '../dtos/login.auth.dto';
import { Request as IRequest } from 'express';
import { UserProtected } from '../decorators/auth-guard.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UserProtected()
  @Get('me')
  async getMe(@Req() req: IRequest) {
    return await this.authService.getMe(req.user as any);
  }

  @Post('login')
  async login(@Body() credentials: LoginAuthDto) {
    return await this.authService.login(credentials);
  }
}
