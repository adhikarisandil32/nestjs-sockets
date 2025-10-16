import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserProtected } from 'src/modules/auth/decorators/auth-guard.decorator';

@ApiTags('Last Conversation Reads')
@Controller('last-conversation-read')
export class ConversationReadController {
  constructor() {}

  @UserProtected()
  @Get('single/:receiverId')
  async getLastSingleReadConvo() {}

  @UserProtected()
  @Get('group/:groupId')
  async getLastGroupReadConvo() {}
}
