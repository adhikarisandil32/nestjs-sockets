import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AuthController } from 'src/modules/auth/controllers/auth.controller';
import { GroupsController } from 'src/modules/groups/controllers/groups.controller';
import { GroupsModule } from 'src/modules/groups/group.module';
import { UsersController } from 'src/modules/users/controllers/users.controller';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [GroupsModule, UsersModule, AuthModule],
  controllers: [GroupsController, UsersController, AuthController],
})
export class ApiRoutesModule {}
