import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config/dist';
import { JwtService } from '@nestjs/jwt/dist';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
// import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UsersRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDto;

    const user = await this.usersRepository.findOne({
      where: { email: email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  // async generateAccessToken(email) {
  //   const payload: JwtPayloadInterface = { email };
  //   const accessToken = await this.jwtService.sign(payload);
  //   return accessToken;
  // }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ passwordResetToken: string }> {
    const { email } = forgotPasswordDto;
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('User with this email was not found!');
    }
    const payload: JwtPayload = { email };
    // Generate the reset password token which expires in 10 mins
    const passwordResetToken = await this.jwtService.sign(payload, {
      expiresIn: '10m',
      secret: this.configService.get('RESET_PASSWORD_JWT_SECRET'),
    });
    if (passwordResetToken) {
      // hash the reset token and update the password resetToken in the database
      const salt = await bcrypt.genSalt();
      const hashedResetToken = await bcrypt.hash(passwordResetToken, salt);
      user.resetToken = hashedResetToken;
      await this.usersRepository.save(user);
      return { passwordResetToken };
    } else {
      throw new InternalServerErrorException('reset password token error');
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<string> {
    const { email, token, password } = resetPasswordDto;
    // Check if user exists
    const user = await this.usersRepository.findOne({ where: { email } });
    // I fuser exists, is there a token value?
    if (!user.resetToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const isValid = await bcrypt.compare(token, user.resetToken);
    if (!isValid) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // Set new password
    user.password = hashPassword;
    // Delete password reset token
    user.resetToken = '';

    return 'Password reset successful';
  }
}
