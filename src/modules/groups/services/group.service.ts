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
      return {};
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

  async getGroupMembers(groupId: number) {
    // const queryBuilder = this._dataSource.createQueryBuilder();
    // const groupMembersQuery = queryBuilder
    //   .from(TableNames.UsersGroupsLinkerTable, 'ug')
    //   .leftJoinAndSelect(TableNames.UsersTable, 'u', 'u.id = ug.user_id')
    //   .leftJoinAndSelect(TableNames.GroupsTable, 'g', 'g.id = ug.group_id')
    //   .select([
    //     'g.id group_id',
    //     'g.name group_name',
    //     'u.id id',
    //     'u.name name',
    //     'u.email email',
    //     'u.role role',
    //     'u.is_active is_active',
    //     'u.created_at created_at',
    //     'u.updated_at updated_at',
    //     'u.deleted_at deleted_at',
    //   ])
    //   .where('ug.group_id = :groupId', { groupId });
    // const groupMembers = await groupMembersQuery.getRawMany();
    // // console.log(groupMembersQuery.getQueryAndParameters());
    // // console.log(groupMembers);
    // return groupMembers;
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
    const queryBuilder = this._dataSource.createQueryBuilder();

    await queryBuilder
      .relation(TableNames.GroupsTable, TableNames.UsersTable)
      .of(groupId)
      .remove(memberIds);

    return;
  }
}
