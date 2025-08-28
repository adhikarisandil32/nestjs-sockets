import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'lakjdlasfd',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.login({ email, password });
    if (!user) {
      throw new UnauthorizedException('request unauthorized');
    }
    return user;
  }
}
