import { IsNumber, IsPositive } from 'class-validator';
import { GroupConversationReadInterface } from '../interfaces/conversation-read.interface';

export class GroupConversationReadDto
  implements GroupConversationReadInterface
{
  @IsPositive()
  @IsNumber()
  lastReadConvoId: number;

  @IsPositive()
  @IsNumber()
  groupId: number;

  @IsPositive()
  @IsNumber()
  senderId: number;
}
