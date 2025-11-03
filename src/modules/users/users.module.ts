import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { FileModule } from '../files/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), FileModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
