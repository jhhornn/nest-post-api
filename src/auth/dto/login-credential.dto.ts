import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginCredentialsDto {
  @ApiProperty({
    example: 'testingmail@mail.com',
    description: 'The email of an existing user',
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Qwerty1234*',
    description: 'The password of an existing user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
