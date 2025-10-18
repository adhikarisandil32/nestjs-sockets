import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LastReadConversationService } from './services/conversation-read.service';
import { ReadSingleConversationEntity } from './entities/single.conversation-read.entity';
import { ReadGroupConversationEntity } from './entities/group.conversation-read.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReadSingleConversationEntity,
      ReadGroupConversationEntity,
    ]),
  ],
  providers: [LastReadConversationService],
  exports: [LastReadConversationService],
})
export class ConversationReadModule {}
