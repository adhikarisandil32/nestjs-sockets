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

  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  ids: number[];
}
