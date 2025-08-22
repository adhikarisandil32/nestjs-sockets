import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CreateGroupDto } from '../dtos/create.group.dto';
import { GroupsService } from '../services/group.service';

@Controller('groups')
export class GroupsController {
  constructor(private readonly _groupService: GroupsService) {}

  @Post('create')
  async create(@Body() createGroupDto: CreateGroupDto) {
    return await this._groupService.create(createGroupDto);
  }

  @Patch(':id/add-members')
  addMembers(@Param('id') groupId: number, @Body() members: CreateGroupDto) {}
}
