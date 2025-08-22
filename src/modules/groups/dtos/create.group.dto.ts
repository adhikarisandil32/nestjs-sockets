import { IsArray, IsInt, IsPositive } from 'class-validator';

export class CreateGroupDto {
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  userIds: number[];
}
