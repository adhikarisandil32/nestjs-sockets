import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from '../entities/group.entity';
import { DataSource, In, Not, Repository } from 'typeorm';
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

    // const queryBuilder = this._dataSource.createQueryBuilder();

    // const insertQuery = await queryBuilder
    //   .insert()
    //   .into(TableNames.UsersGroupsLinkerTable)
    //   .values(
    //     newMembers.map((member) => ({
    //       group_id: groupId,
    //       user_id: member.id,
    //     })),
    //   )
    //   .orIgnore()
    //   .execute();

    const groupInfo = await this._groupRepo.findOne({
      where: { id: groupId },
    });

    if (!groupInfo) {
      return;
    }

    const preparedDataForUpdate: GroupEntity = {
      ...groupInfo,
      users: newMembers,
    };

    await this._groupRepo.save(preparedDataForUpdate);
  }

  async removeMembers({
    groupId,
    memberIds,
  }: {
    groupId: number;
    memberIds: number[];
  }) {
    const groupInfo = await this._groupRepo.findOne({
      // in this query, we fetch that users from groups that are not provided on the memberIds, so that we can directly use them to save method. However holding millions of data in memory can be very expensive memory task.
      where: {
        id: groupId,
        users: {
          id: Not(In(memberIds)),
        },
      },
      relations: ['users'],
      select: {
        id: true,
        users: {
          id: true,
        },
      },
    });

    if (!groupInfo) {
      return;
    }

    const preparedGroupUpdateData: GroupEntity = {
      ...groupInfo,
      users: groupInfo.users,
    };

    await this._groupRepo.save(preparedGroupUpdateData);
  }
}
