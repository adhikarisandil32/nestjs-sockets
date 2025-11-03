import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AuthController } from 'src/modules/auth/controllers/auth.controller';
import { ConversationReadController } from 'src/modules/conversation-reads/controllers/conversation-read.controller';
import { ConversationReadModule } from 'src/modules/conversation-reads/conversation-read.module';
import { ConversationController } from 'src/modules/conversations/controllers/conversation.controller';
import { ConversationModule } from 'src/modules/conversations/conversation.module';
import { FileController } from 'src/modules/files/controllers/file.controller';
import { FileModule } from 'src/modules/files/file.module';
import { GroupsController } from 'src/modules/groups/controllers/groups.controller';
import { GroupsModule } from 'src/modules/groups/group.module';
import { UsersController } from 'src/modules/users/controllers/users.controller';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    AuthModule,
    GroupsModule,
    UsersModule,
    ConversationModule,
    ConversationReadModule,
    FileModule,
  ],
  controllers: [
    AuthController,
    GroupsController,
    UsersController,
    ConversationController,
    ConversationReadController,
    FileController,
  ],
})
export class ApiRoutesModule {}
