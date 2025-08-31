import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from '../entities/group.entity';
import { DataSource, In, Repository } from 'typeorm';
import { CreateGroupDto } from '../dtos/create.group.dto';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { TableNames } from 'src/common/database/constants/common.constant';

export class GroupsService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly _groupRepo: Repository<GroupEntity>,
    private readonly _dataSource: DataSource,
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    const existingUsers = await this._dataSource
      .getRepository(UserEntity)
      .find({
        where: createGroupDto.ids.map((userId) => ({
          id: userId,
        })),
      });

    if (existingUsers.length <= 0) {
      return [];
    }

    const groupMembers = this._groupRepo.create(existingUsers);
    await this._groupRepo.save(groupMembers);

    return groupMembers;
  }

  async getGroupMembers(groupId: number) {
    const queryBuilder = this._dataSource.createQueryBuilder();

    const groupMembersQuery = queryBuilder
      .from(TableNames.UsersGroupsLinkerTable, 'ug')
      .leftJoinAndSelect(TableNames.UsersTable, 'u', 'u.id = ug.user_id')
      .leftJoinAndSelect(TableNames.GroupsTable, 'g', 'g.id = ug.group_id')
      .select([
        'g.id group_id',
        'g.name group_name',
        'u.id id',
        'u.name name',
        'u.email email',
        'u.role role',
        'u.is_active is_active',
        'u.created_at created_at',
        'u.updated_at updated_at',
        'u.deleted_at deleted_at',
      ])
      .where('ug.group_id = :groupId', { groupId });

    const groupMembers = await groupMembersQuery.getRawMany();

    // console.log(groupMembersQuery.getQueryAndParameters());
    // console.log(groupMembers);

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
          user_id: member.id,
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
