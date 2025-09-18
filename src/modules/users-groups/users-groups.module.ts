import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { GroupsModule } from '../groups/group.module';
import { UsersGroupsService } from './services/users-groups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGroupEntity } from './entities/users-groups.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserGroupEntity]),
    UsersModule,
    GroupsModule,
  ],
  providers: [UsersGroupsService],
  exports: [UsersGroupsService],
})
export class UsersGroupsModule {}
