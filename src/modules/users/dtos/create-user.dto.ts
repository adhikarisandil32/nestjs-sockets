import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { USER_ROLE } from '../constants/user.constant';

export class CreateUserDto {
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

  @ApiProperty({
    example: 1,
    type: 'number',
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  profilePictureId: number;
}

export class CreateUserDtoSelf extends CreateUserDto {
  @IsEnum(USER_ROLE)
  @IsNotEmpty()
  @IsString()
  role: USER_ROLE = USER_ROLE.USER;
}

export class CreateUserDtoAdmin extends CreateUserDto {
  @ApiProperty({
    example: USER_ROLE.USER,
    type: 'string',
  })
  @IsEnum(USER_ROLE)
  @IsNotEmpty()
  @IsString()
  role: USER_ROLE = USER_ROLE.USER;

  @IsBoolean()
  isActive: true = true;
}
