import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({
    type: 'string',
    example: "Friends' Circle",
  })
  @IsString()
  @IsOptional()
  name: string = 'My Group';

  // @IsInt()
  // @IsPositive()
  // groupAdminId: number;

  @ApiProperty({
    type: 'array',
    example: [1, 2, 3],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  memberIds: number[];

  @ApiProperty({
    type: 'number',
    example: 1,
  })
  @IsOptional()
  @IsPositive()
  @IsInt()
  profileImageId?: number;
}
