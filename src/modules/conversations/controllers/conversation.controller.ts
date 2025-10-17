import { Body, Controller, Get, Param } from '@nestjs/common';
import { ConversationService } from '../services/conversation.service';
import { UserProtected } from 'src/modules/auth/decorators/auth-guard.decorator';
import { User } from 'src/modules/auth/decorators/param.decorator';
import { UserEntity } from 'src/modules/users/entities/user.entity';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly convoService: ConversationService) {}

  @UserProtected()
  @Get(':receiverId/single-all')
  async getAllSingleConvos(
    @User() user: UserEntity,
    @Param('receiverId') receiverId: number,
  ) {
    return await this.convoService.getSingleConvos({
      userIds: {
        senderId: user.id,
        receiverId,
      },
    });
  }

  @UserProtected()
  @Get(':groupId/group-all')
  async getAllGroupConvos(@Param('groupId') groupId: number) {
    return await this.convoService.getGroupConvo({
      groupId,
    });
  }
}
