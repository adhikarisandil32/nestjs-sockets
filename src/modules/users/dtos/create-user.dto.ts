import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { ICreateUser } from '../interfaces/create-user.interface';
import { USER_ROLE } from '../constants/user.constant';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto implements ICreateUser {
  @ApiProperty({
    example: 'useremail@gmail.com',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'John Doe',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Test@123',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsEnum(USER_ROLE)
  role: USER_ROLE = USER_ROLE.USER;

  @ApiProperty({
    example: 1,
    type: 'number',
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  profilePictureId: number;
}
