import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGroupEntity } from '../entities/users-groups.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersGroupsService {
  constructor(
    @InjectRepository(UserGroupEntity)
    private readonly userGroupService: Repository<UserGroupEntity>,
  ) {}

  async create(createUserGroup: any) {
    console.log(createUserGroup);
  }

  async checkUserInGroup({
    memberId,
    groupId,
  }: {
    memberId: number;
    groupId: number;
  }) {
    return await this.userGroupService.findOne({
      where: {
        group: {
          id: groupId,
        },
        member: {
          id: memberId,
        },
      },
    });
  }
}
