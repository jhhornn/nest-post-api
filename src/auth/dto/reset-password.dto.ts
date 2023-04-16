import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'testingmail@mail.com',
    description:
      'The email of an existing user that requested for change of password',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpRWNU7.eyJlbWFpbCI6InRlc3QyQG1haWtrY29tIiwiaWF0IjghNjgxNjA5Mjg2LCJleHAiOjE2ODE2MTI4ODZ9.DxqQWvl7pfxppUuK6_VLGDTHdcTZdYEg4Z_BolTaCCX4',
    description:
      'The token generated from /forgot-password route to reset password',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    example: 'SuperSecret1234#',
    description: 'The new password to be changed to',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
