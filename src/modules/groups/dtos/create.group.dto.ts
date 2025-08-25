import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: 'my group';

  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  ids: number[];
}
