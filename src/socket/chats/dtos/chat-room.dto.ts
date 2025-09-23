import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';

export class ChatRoomDto {
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  userIds: number[];
}
