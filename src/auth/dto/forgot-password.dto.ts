import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'testingmail@mail.com',
    description: 'The email of an existing user that wants to change password',
  })
  @IsNotEmpty()
  @IsString()
  email: string;
}
