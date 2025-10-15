import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    example: 'admin@gmail.com',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    example: 'Test@123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
