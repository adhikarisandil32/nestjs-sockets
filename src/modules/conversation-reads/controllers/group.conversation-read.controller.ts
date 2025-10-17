import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserProtected } from 'src/modules/auth/decorators/auth-guard.decorator';
import { User } from 'src/modules/auth/decorators/param.decorator';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { LastReadConversationService } from '../services/conversation-read.service';

@ApiTags('Last Read Conversation')
@Controller('last-conversation-read')
export class ConversationReadController {
  constructor(
    private readonly lastReadConvoService: LastReadConversationService,
  ) {}

  @UserProtected()
  @Get('single/:userId')
  async getLastSingleReadConvo(
    @User() user: UserEntity,
    @Param('userId') userId: number,
  ) {
    return await this.lastReadConvoService.getSingleLastReadConvo({
      requestingUserId: user.id,
      requestedUserId: userId,
    });
  }

  @UserProtected()
  @Get('group/:groupId')
  async getLastGroupReadConvo(
    @Param('groupId') groupId: number,
    @User() user: UserEntity,
  ) {
    return await this.lastReadConvoService.getGroupLastReadConvo({
      userId: user.id,
      groupId,
    });
  }
}
