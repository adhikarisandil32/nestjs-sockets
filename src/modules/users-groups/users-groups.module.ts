import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { GroupsModule } from '../groups/group.module';
import { GroupsService } from '../groups/services/group.service';
import { UsersService } from '../users/services/users.service';
import { UsersGroupsService } from './services/users-groups.service';

@Module({
  imports: [UsersModule, GroupsModule],
  controllers: [],
  providers: [UsersService, GroupsService, UsersGroupsService],
  exports: [UsersGroupsService],
})
export class UsersGroupsModule {}
