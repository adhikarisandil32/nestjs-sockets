import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateGroupConversationDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNumber()
  @IsPositive()
  senderId: number;

  @IsNumber()
  @IsPositive()
  groupId: number;
}

export class CreateSingleConversationDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNumber()
  @IsPositive()
  senderId: number;

  @IsNumber()
  @IsPositive()
  receiverId: number;
}
