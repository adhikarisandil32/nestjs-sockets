import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateGroupDto } from '../dtos/create.group.dto';
import { GroupsService } from '../services/group.service';
import { AddMmbersDto, RemoveMembersDto } from '../dtos/update.group.dto';
import { PutUserToRequest } from 'src/modules/auth/guards/put-user.guard';
import { UserProtected } from 'src/modules/auth/decorators/auth-guard.decorator';
import { User } from 'src/modules/auth/decorators/param.decorator';
import { UserEntity } from 'src/modules/users/entities/user.entity';

@Controller('groups')
export class GroupsController {
  constructor(private readonly _groupService: GroupsService) {}

  @Get(':id/members')
  async getGroupById(@Param('id') groupId: number) {
    return await this._groupService.getGroupMembers(groupId);
  }

  @UserProtected()
  @Post('create')
  async create(
    @User() user: UserEntity,
    @Body() createGroupDto: CreateGroupDto,
  ) {
    return await this._groupService.create(user, createGroupDto);
  }

  @Patch(':id/add-members')
  async addMembers(
    @Param('id') groupId: number,
    @Body() updateGroupDto: AddMmbersDto,
  ) {
    if (
      updateGroupDto.memberIds == null ||
      updateGroupDto.memberIds.length <= 0
    ) {
      return;
    }

    return await this._groupService.addMembers({
      groupId,
      newMemberIds: updateGroupDto.memberIds,
    });
  }

  @Patch(':id/remove-members')
  async removeMembers(
    @Param('id') groupId: number,
    @Body() removeMembersDto: RemoveMembersDto,
  ) {
    if (
      removeMembersDto.memberIds == null ||
      removeMembersDto.memberIds.length <= 0
    ) {
      return;
    }

    return await this._groupService.removeMembers({
      groupId,
      memberIds: removeMembersDto.memberIds,
    });
  }
}
