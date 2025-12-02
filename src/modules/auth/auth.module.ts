import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { FileModule } from '../files/file.module';
import { RedisServiceModule } from 'src/common/redis/services/redis.service.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule,
    FileModule,
    RedisServiceModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
