import { Controller, Post } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { CreateMessageDto } from '../dtos/create.message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('create')
  async createMessage(createMessageDto: CreateMessageDto) {
    await this.messageService.createMessage(createMessageDto);
  }
}
