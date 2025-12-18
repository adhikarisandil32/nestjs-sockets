import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateGroupDto } from '../dtos/create.group.dto';
import { GroupsService } from '../services/group.service';
import { AddMmbersDto, RemoveMembersDto } from '../dtos/update.group.dto';
import { UserProtected } from 'src/modules/auth/decorators/auth-guard.decorator';
import { User } from 'src/modules/auth/decorators/param.decorator';
import { UserEntity } from 'src/modules/users/entities/user.entity';

@Controller('groups')
export class GroupsController {
  constructor(private readonly _groupService: GroupsService) {}

  @UserProtected()
  @Post('create')
  async create(
    @User() user: UserEntity,
    @Body() createGroupDto: CreateGroupDto,
  ) {
    return await this._groupService.create(user, createGroupDto);
  }

  @UserProtected()
  @Get('me-member')
  async getMeMemberGroups(@User() user: UserEntity) {
    return await this._groupService.getMeMemberGroups({ userId: user.id });
  }

  @UserProtected()
  @Get('me-admin')
  async getMeAdminGroups(@User() user: UserEntity) {
    return await this._groupService.getMeAdminGroups({ userId: user.id });
  }

  @UserProtected()
  @Get(':id/members')
  async getGroupById(@Param('id') groupId: number, @User() user: UserEntity) {
    return await this._groupService.getGroupMembers({
      groupId,
      userId: user.id,
    });
  }

  @UserProtected()
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

  @UserProtected()
  @Patch(':id/remove-members')
  async removeMembers(
    @Param('id') groupId: number,
    @Body() removeMembersDto: RemoveMembersDto,
    @User() user: UserEntity,
  ) {
    if (
      removeMembersDto.memberIds == null ||
      removeMembersDto.memberIds.length <= 0
    ) {
      throw new BadRequestException('no users selected to remove');
    }

    return await this._groupService.removeMembers({
      groupId,
      memberIds: removeMembersDto.memberIds,
      requestingUser: user,
    });
  }

  @Get('get-all')
  async getAllGroups() {
    return await this._groupService.getAll();
  }
}
