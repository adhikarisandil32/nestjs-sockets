import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from '../entities/group.entity';
import { DataSource, In, Repository } from 'typeorm';
import { CreateGroupDto } from '../dtos/create.group.dto';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { TableNames } from 'src/common/database/constants/common.constant';
import { UserGroupEntity } from 'src/modules/users-groups/entities/users-groups.entity';
import { BadRequestException } from '@nestjs/common';

export class GroupsService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly _groupRepo: Repository<GroupEntity>,
    private readonly _dataSource: DataSource,
  ) {}

  async create(groupAdmin: UserEntity, createGroupDto: CreateGroupDto) {
    const usersForGroup = await this._dataSource
      .getRepository(UserEntity)
      .find({
        where: createGroupDto.memberIds.map((memberId) => ({
          id: memberId,
        })),
      });

    if (!groupAdmin) {
      throw new BadRequestException('no group admin data');
    }

    if (usersForGroup.length <= 0) {
      throw new BadRequestException('no member to the group');
    }

    const queryRunner = this._dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const qrEntityManager = queryRunner.manager;

      const preparedGroupCreateData = qrEntityManager.create(GroupEntity, {
        name: createGroupDto.name,
        groupAdmin,
      });

      await qrEntityManager.save(preparedGroupCreateData);

      const preparedGroupsUsersCreateData = qrEntityManager.create(
        UserGroupEntity,
        [
          {
            group: {
              id: preparedGroupCreateData.id,
            },
            member: groupAdmin,
          },
          ...usersForGroup.map((user) => ({
            group: {
              id: preparedGroupCreateData.id,
            },
            member: user,
          })),
        ],
      );

      await qrEntityManager.save(preparedGroupsUsersCreateData);

      await queryRunner.commitTransaction();

      return {
        ...preparedGroupCreateData,
        members: usersForGroup.map((user) => ({
          id: user.id,
          email: user.email,
          isActive: user.isActive,
        })),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllGroups({ userId }: { userId: number }) {
    return await this._dataSource.getRepository(UserGroupEntity).find({
      where: {
        member: {
          id: userId,
        },
      },
      relations: {
        group: true,
      },
    });
  }

  async getGroupMembers({
    groupId,
    userId,
  }: {
    groupId: number;
    userId: number;
  }) {
    const userExistsInGroup = await this._dataSource
      .getRepository(UserGroupEntity)
      .findOne({
        where: {
          member: {
            id: userId,
          },
          group: {
            id: groupId,
          },
        },
      });

    if (!userExistsInGroup) {
      throw new BadRequestException("user doesn't belong to group");
    }

    const groupMembers = await this._dataSource
      .getRepository(UserGroupEntity)
      .find({
        where: {
          group: {
            id: groupId,
          },
        },
        relations: {
          member: true,
        },
      });

    return groupMembers;
  }

  async addMembers({
    groupId,
    newMemberIds,
  }: {
    groupId: number;
    newMemberIds: number[];
  }) {
    const newMembers = await this._dataSource.getRepository(UserEntity).find({
      where: {
        id: In(newMemberIds),
      },
      select: {
        id: true,
      },
    });

    const queryBuilder = this._dataSource.createQueryBuilder();

    await queryBuilder
      .insert()
      .into(TableNames.UsersGroupsLinkerTable)
      .values(
        newMembers.map((member) => ({
          group_id: groupId,
          member_id: member.id,
        })),
      )
      .orIgnore()
      .execute();

    return;
  }

  async removeMembers({
    groupId,
    memberIds,
  }: {
    groupId: number;
    memberIds: number[];
  }) {
    const groupAdmin = await this._groupRepo.findOne({
      where: {
        id: groupId,
        groupAdmin: {
          id: requestingUser.id,
          email: requestingUser.email,
        },
      },
      relations: {
        groupAdmin: true,
      },
    });

    if (!groupAdmin) {
      throw new BadRequestException('only admin can remove members');
    }

    const queryBuilder = this._dataSource.createQueryBuilder();

    await queryBuilder
      .relation(TableNames.GroupsTable, TableNames.UsersTable)
      .of(groupId)
      .remove(memberIds);

    return;
  }
}
