import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from '../entities/group.entity';
import { DataSource, In, Repository } from 'typeorm';
import { CreateGroupDto } from '../dtos/create.group.dto';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { TableNames } from 'src/common/database/constants/common.constant';
import { UserGroupEntity } from 'src/modules/users-groups/entities/users-groups.entity';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { FileEntity } from 'src/modules/files/entities/file.entity';
import { Folder } from 'src/modules/files/constants/folders.file-upload';
import { UserGroupJoinStatus } from 'src/modules/users-groups/constants/user-group.constant';
import { FileService } from 'src/modules/files/services/file.service';

export class GroupsService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly _groupRepo: Repository<GroupEntity>,
    private readonly fileService: FileService,
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
      throw new BadRequestException('no group-admin data');
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

      let updatedProfileImage: FileEntity | null = null;

      if (createGroupDto.profileImageId) {
        const uploadedProfileImage = await qrEntityManager
          .getRepository(FileEntity)
          .findOne({
            where: {
              id: createGroupDto.profileImageId,
            },
          });

        if (!uploadedProfileImage) {
          throw new NotFoundException('profile image not found');
        }

        if (
          uploadedProfileImage.associationId ||
          uploadedProfileImage.associationType
        ) {
          throw new ConflictException('profile image already used');
        }

        uploadedProfileImage.associationId = preparedGroupCreateData.id;
        uploadedProfileImage.associationType = Folder.Group;

        updatedProfileImage = await qrEntityManager
          .getRepository(FileEntity)
          .save(uploadedProfileImage);
      }

      const preparedGroupsUsersCreateData = qrEntityManager.create(
        UserGroupEntity,
        [
          {
            group: {
              id: preparedGroupCreateData.id,
            },
            member: groupAdmin,
            joinStatus: UserGroupJoinStatus.Approved,
          },
          ...usersForGroup.map((user) => ({
            group: {
              id: preparedGroupCreateData.id,
            },
            member: {
              id: user.id,
            },
            joinStatus: UserGroupJoinStatus.Pending,
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
        profileImage: updatedProfileImage,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getMeMemberGroups({ userId }: { userId: number }) {
    const groups = await this._dataSource.getRepository(UserGroupEntity).find({
      where: {
        member: {
          id: userId,
        },
        joinStatus: UserGroupJoinStatus.Approved,
      },
      relations: {
        group: true,
      },
    });

    // console.log(groups);

    // const profileImages = await this._dataSource
    //   .getRepository(FileEntity)
    //   .find({
    //     where: {
    //       associationId: In(groups.map((group) => group.group.id)),
    //       associationType: Folder.Group,
    //     },
    //   });

    // return groups.map((group) => ({
    //   ...group,
    //   group: {
    //     ...group.group,
    //     profileImage:
    //       profileImages.find((image) => image?.associationId === group.id) ??
    //       null,
    //   },
    // }));

    return groups;
  }

  async getMeAdminGroups({ userId }: { userId: number }) {
    const groupsMeAdmin = await this._groupRepo.find({
      where: {
        groupAdmin: {
          id: userId,
        },
      },
    });

    const profileImages = await this._dataSource
      .getRepository(FileEntity)
      .find({
        where: {
          associationId: In(groupsMeAdmin.map((group) => group.id)),
          associationType: Folder.Group,
        },
      });

    return groupsMeAdmin.map((group) => ({
      ...group,
      profileImage:
        profileImages.find((image) => image?.associationId === group.id) ??
        null,
    }));
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
      throw new ForbiddenException("user doesn't belong to group");
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
    requestingUser,
  }: {
    groupId: number;
    memberIds: number[];
    requestingUser: UserEntity;
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
