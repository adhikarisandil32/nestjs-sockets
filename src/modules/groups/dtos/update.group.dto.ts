import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create.group.dto';

export class RemoveMembersDto extends PartialType(CreateGroupDto) {}

export class AddMmbersDto extends PartialType(CreateGroupDto) {}
