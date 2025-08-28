import { Module } from '@nestjs/common';
import { GroupsController } from 'src/modules/groups/controllers/groups.controller';
import { GroupsModule } from 'src/modules/groups/group.module';
import { UsersController } from 'src/modules/users/controllers/users.controller';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [GroupsModule, UsersModule],
  controllers: [GroupsController, UsersController],
})
export class ApiRoutesModule {}
