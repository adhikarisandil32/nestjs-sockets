import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationService } from './services/conversation.service';
import { SingleConversationEntity } from './entities/single.conversation.entity';
import { GroupConversationEntity } from './entities/group.conversation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SingleConversationEntity,
      GroupConversationEntity,
    ]),
  ],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
