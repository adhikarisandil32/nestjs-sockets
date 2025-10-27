import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MESSAGE_STATUS } from '../constants/conversation.constant';
import { SingleConversationEntity } from '../entities/single.conversation.entity';
import { GroupConversationEntity } from '../entities/group.conversation.entity';
import {
  CreateGroupConversationDto,
  CreateSingleConversationDto,
} from '../dtos/create.conversation.dto';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(SingleConversationEntity)
    private readonly singleConvRepo: Repository<SingleConversationEntity>,
    @InjectRepository(GroupConversationEntity)
    private readonly groupConvoRepo: Repository<GroupConversationEntity>,
  ) {}

  async createSingleConvo(singleConvoDto: CreateSingleConversationDto) {
    const preparedMessage = this.singleConvRepo.create({
      message: singleConvoDto.message,
      sender: {
        id: singleConvoDto.senderId,
      },
      receiver: {
        id: singleConvoDto.receiverId,
      },
      status: MESSAGE_STATUS.SENT,
    });

    await this.singleConvRepo.save(preparedMessage);

    return preparedMessage;
  }

  async createGroupConvo(groupConvoDto: CreateGroupConversationDto) {
    const preparedMessage = this.groupConvoRepo.create({
      message: groupConvoDto.message,
      sender: {
        id: groupConvoDto.senderId,
      },
      group: {
        id: groupConvoDto.groupId,
      },
      status: MESSAGE_STATUS.SENT,
    });

    await this.groupConvoRepo.save(preparedMessage);

    return preparedMessage;
  }

  async getSingleConvos({
    userIds,
  }: {
    userIds: {
      senderId: number;
      receiverId: number;
    };
  }) {
    return await this.singleConvRepo.find({
      where: [
        {
          sender: In([userIds.receiverId, userIds.senderId]),
        },
        {
          receiver: In([userIds.receiverId, userIds.senderId]),
        },
      ],
      order: {
        createdAt: 'DESC',
      },
      select: {
        sender: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      relations: {
        sender: true,
      },
    });
  }

  async getGroupConvo({ groupId }: { groupId: number }) {
    return await this.groupConvoRepo.find({
      where: {
        group: {
          id: groupId,
        },
      },
      relations: {
        sender: true,
      },
      select: {
        sender: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
