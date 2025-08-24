import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from '../entities/group.entity';
import { DataSource, In, Repository } from 'typeorm';
import { CreateGroupDto } from '../dtos/create.group.dto';
import { UserEntity } from 'src/modules/users/entities/user.entity';

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
    });

    const queryBuilder = this._dataSource.createQueryBuilder();

    // await queryBuilder
    //   .relation(GroupEntity, 'users')
    //   .of(groupId)
    //   .add(newMembers);

    await queryBuilder
      .insert()
      .into('groups_users')
      .values(
        newMembers.map((member) => ({
          group_id: groupId,
          user_id: member.id,
        })),
      )
      .orIgnore()
      .execute();
  }

  async removeMember({
    groupId,
    memberId,
  }: {
    groupId: number;
    memberId: number;
  }) {
    const member = await this._dataSource.getRepository(UserEntity).findOne({
      where: {
        id: memberId,
      },
    });

    const queryBuilder = this._groupRepo.createQueryBuilder();
  }
}
