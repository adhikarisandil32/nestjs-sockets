import {
  IsArray,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsOptional()
  name: 'my group';

  // @IsInt()
  // @IsPositive()
  // groupAdminId: number;

  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  memberIds: number[];
}
