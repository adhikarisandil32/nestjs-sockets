import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { ChatService } from './services/chats.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/modules/users/users.module';
import { MessagesModule } from 'src/modules/messages/messages.module';
import { UsersGroupsModule } from 'src/modules/users-groups/users-groups.module';

@Module({
  imports: [UsersModule, MessagesModule, UsersGroupsModule],
  providers: [ChatGateway, ChatService, JwtService, ConfigService],
})
export class ChatModule {}
