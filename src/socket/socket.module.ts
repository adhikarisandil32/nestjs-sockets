import { Module } from '@nestjs/common';
import { ChatModule } from './chats/chats.module';

@Module({
  imports: [ChatModule],
})
export class SocketModule {}
