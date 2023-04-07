import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginCredentialsDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
