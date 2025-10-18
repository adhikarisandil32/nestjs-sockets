import { IsNumber, IsPositive } from 'class-validator';
import { SingleConversationReadInterface } from '../interfaces/conversation-read.interface';

export class SingleConversationReadDto
  implements SingleConversationReadInterface
{
  @IsPositive()
  @IsNumber()
  requestingUserId: number;

  @IsPositive()
  @IsNumber()
  requestedUserId: number;

  @IsPositive()
  @IsNumber()
  lastReadConvoId: number;
}
