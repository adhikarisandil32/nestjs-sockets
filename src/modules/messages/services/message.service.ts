import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from '../dtos/create.message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from '../entities/message.entity';
import { Repository } from 'typeorm';
import { MESSAGE_STATUS } from '../constants/message.constant';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const preparedMessage = this.messageRepo.create({
      message: createMessageDto.message,
      sender: {
        id: createMessageDto.senderId,
      },
      group: {
        id: createMessageDto.groupId,
      },
      status: MESSAGE_STATUS.SENT,
    });

    await this.messageRepo.save(preparedMessage);
  }
}
