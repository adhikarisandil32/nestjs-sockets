import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from '../entities/group.entity';
import { DataSource, In, Not, Repository, Table } from 'typeorm';
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

  async getGroupInfo(groupId: number) {}

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

    console.log(newMembers);

    // const groupInfo = await this._groupRepo.findOne({
    //   where: { id: groupId },
    //   relations: ['users'],
    //   select: {
    //     id: true,
    //     users: {
    //       id: true,
    //     },
    //   },
    // });

    // if (!groupInfo) {
    //   return;
    // }

    // const preparedDataForUpdate: GroupEntity = {
    //   ...groupInfo,
    //   users: [...newMembers, ...(groupInfo.users ?? [])],
    // };

    // await this._groupRepo.save(preparedDataForUpdate);

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
  }

  async removeMembers({
    groupId,
    memberIds,
  }: {
    groupId: number;
    memberIds: number[];
  }) {
    const queryBuilder = this._groupRepo.createQueryBuilder('g');

    const groupWithAdmin = await queryBuilder
      .leftJoinAndSelect('g.groupAdmin', 'group_ad')
      .addSelect(['group_ad.id', 'group_ad.name', 'group_ad.email'])
      .where('g.id = :groupId', { groupId })
      .getMany();

    // const groupWithAdmin = await this._groupRepo.find({
    //   relations: ['users', 'groupAdmin'],
    // });

    console.log(groupWithAdmin);

    // await queryBuilder
    //   .relation(TableNames.GroupsTable, TableNames.UsersTable)
    //   .of(groupId)
    //   .remove(memberIds);
  }
}
