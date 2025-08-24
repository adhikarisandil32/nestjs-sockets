import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CreateGroupDto } from '../dtos/create.group.dto';
import { GroupsService } from '../services/group.service';
import { UpdateGroupDto } from '../dtos/update.group.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly _groupService: GroupsService) {}

  @Post('create')
  async create(@Body() createGroupDto: CreateGroupDto) {
    return await this._groupService.create(createGroupDto);
  }

  @Patch(':id/add-members')
  async addMembers(
    @Param('id') groupId: number,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    if (updateGroupDto.ids == null || updateGroupDto.ids.length <= 0) {
      return;
    }

    return await this._groupService.addMembers({
      groupId,
      newMemberIds: updateGroupDto.ids,
    });
  }
}
