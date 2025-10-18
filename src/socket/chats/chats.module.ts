import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { ChatService } from './services/chats.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/modules/users/users.module';
import { UsersGroupsModule } from 'src/modules/users-groups/users-groups.module';
import { ConversationModule } from 'src/modules/conversations/conversation.module';
import { GroupsModule } from 'src/modules/groups/group.module';
import { ConversationReadModule } from 'src/modules/conversation-reads/conversation-read.module';

@Module({
  imports: [
    UsersModule,
    ConversationModule,
    UsersGroupsModule,
    GroupsModule,
    ConversationReadModule,
  ],
  providers: [ChatGateway, ChatService, JwtService, ConfigService],
})
export class ChatModule {}
