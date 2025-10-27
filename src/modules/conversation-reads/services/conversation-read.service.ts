import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReadSingleConversationEntity } from '../entities/single.conversation-read.entity';
import { ReadGroupConversationEntity } from '../entities/group.conversation-read.entity';
import { DataSource, Repository } from 'typeorm';
import { SingleConversationEntity } from 'src/modules/conversations/entities/single.conversation.entity';

@Injectable()
export class LastReadConversationService {
  constructor(
    @InjectRepository(ReadSingleConversationEntity)
    private readonly singleLastReadConvo: Repository<ReadSingleConversationEntity>,
    @InjectRepository(ReadGroupConversationEntity)
    private readonly groupLastReadConvo: Repository<ReadGroupConversationEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async getSingleLastReadConvo({
    requestingUserId,
    requestedUserId,
  }: {
    requestingUserId: number;
    requestedUserId: number;
  }) {
    const lastReadConvo = await this.singleLastReadConvo.findOne({
      where: {
        requestingUserId,
        requestedUserId,
      },
    });

    return lastReadConvo ?? {};
  }

  async getGroupLastReadConvo({
    groupId,
    userId,
  }: {
    groupId: number;
    userId: number;
  }) {
    const lastReadConvo = await this.groupLastReadConvo.findOne({
      where: {
        groupId,
        senderId: userId,
      },
    });

    return lastReadConvo ?? {};
  }

  async updateSingleLastReadConvo({
    requestingUserId,
    requestedUserId,
    lastReadConversationId,
  }: {
    requestingUserId: number;
    requestedUserId: number;
    lastReadConversationId: number;
  }) {
    const conversation = await this.dataSource
      .getRepository(SingleConversationEntity)
      .findOne({
        where: {
          id: lastReadConversationId,
        },
      });

    if (!conversation) {
      throw new NotFoundException("such conversation doesn't exist");
    }

    const lastReadConvo = await this.singleLastReadConvo.findOne({
      where: {
        requestingUserId,
        requestedUserId,
      },
    });

    if (!lastReadConvo) {
      const lastReadConvoData = this.singleLastReadConvo.create({
        requestedUserId,
        requestingUserId,
        lastReadConvoId: lastReadConversationId,
      });

      await this.singleLastReadConvo.save(lastReadConvoData);

      return lastReadConvoData;
    }

    await this.singleLastReadConvo.update(lastReadConvo.id, {
      lastReadConvoId: lastReadConversationId,
    });

    return await this.singleLastReadConvo.findOne({
      where: { id: lastReadConvo.id },
    });
  }

  async updateGroupLastReadConvo({
    groupId,
    senderId,
    lastReadConversationId,
  }: {
    groupId: number;
    senderId: number;
    lastReadConversationId: number;
  }) {
    const conversation = await this.dataSource
      .getRepository(SingleConversationEntity)
      .findOne({
        where: {
          id: lastReadConversationId,
        },
      });

    if (!conversation) {
      throw new NotFoundException("such conversation doesn't exist");
    }

    const lastReadConvo = await this.groupLastReadConvo.findOne({
      where: {
        groupId,
        senderId,
      },
    });

    if (!lastReadConvo) {
      const lastReadConvoPreparedData = this.groupLastReadConvo.create({
        groupId,
        senderId,
        lastReadConvoId: lastReadConversationId,
      });

      await this.groupLastReadConvo.save(lastReadConvoPreparedData);

      return lastReadConvoPreparedData;
    }

    await this.groupLastReadConvo.update(lastReadConvo.id, {
      lastReadConvoId: lastReadConversationId,
    });

    return await this.groupLastReadConvo.findOne({
      where: { id: lastReadConvo.id },
    });
  }
}
