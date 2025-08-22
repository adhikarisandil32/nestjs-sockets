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
        where: createGroupDto.userIds.map((userId) => ({
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
    memberIds,
  }: {
    groupId: number;
    memberIds: number[];
  }) {
    const newMembers = await this._dataSource.getRepository(UserEntity).find({
      where: {
        id: In(memberIds),
      },
    });

    const queryBuilder = this._groupRepo.createQueryBuilder();

    await queryBuilder
      .relation(GroupEntity, 'users')
      .of(groupId)
      .add(newMembers);
  }

  async removeMember(groupId: number, memberId: number) {}
}
