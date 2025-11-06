import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class ChatRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string = 'my group';

  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  userIds: number[];

  @IsNumber()
  @IsPositive()
  @IsOptional()
  profileImageId?: number;
}
