import { IsArray, IsInt, IsPositive } from 'class-validator';

export class ChatRoomDto {
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  userIds: number[];
}
