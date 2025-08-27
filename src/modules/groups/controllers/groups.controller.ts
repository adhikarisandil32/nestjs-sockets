import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateGroupDto } from '../dtos/create.group.dto';
import { GroupsService } from '../services/group.service';
import { AddMmbersDto, RemoveMembersDto } from '../dtos/update.group.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly _groupService: GroupsService) {}

  @Get(':id/members')
  async getGroupById(@Param('id') groupId: number) {
    return await this._groupService.getGroupMembers(groupId);
  }

  @Post('create')
  async create(@Body() createGroupDto: CreateGroupDto) {
    return await this._groupService.create(createGroupDto);
  }

  @Patch(':id/add-members')
  async addMembers(
    @Param('id') groupId: number,
    @Body() updateGroupDto: AddMmbersDto,
  ) {
    if (updateGroupDto.ids == null || updateGroupDto.ids.length <= 0) {
      return;
    }

    return await this._groupService.addMembers({
      groupId,
      newMemberIds: updateGroupDto.ids,
    });
  }

  @Patch(':id/remove-members')
  async removeMembers(
    @Param('id') groupId: number,
    @Body() removeMembersDto: RemoveMembersDto,
  ) {
    if (removeMembersDto.ids == null || removeMembersDto.ids.length <= 0) {
      return;
    }

    return await this._groupService.removeMembers({
      groupId,
      memberIds: removeMembersDto.ids,
    });
  }
}
