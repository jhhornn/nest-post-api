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
      // update the password resetToken in the database
      user.resetToken = passwordResetToken;
      await this.usersRepository.save(user);
      return { passwordResetToken };
    } else {
      throw new InternalServerErrorException('reset password token error');
    }
  }

  // async resetPassword (resetPasswordDto: ResetPasswordDto) {

  // }

  //   async sendForgotPasswordLinkOnEmail(forgotPasswordLink, email) {
  //     await this.mailService.sendMail({
  //       to: email,
  //       from: process.env.SMTP_USER,
  //       subject: `Change your password on ${process.env.CLIENT_HOST}`,
  //       text: '',
  //       html:
  //         `
  //           <div>
  //             <h1>Hello! Follow the link to change your password on ${process.env.CLIENT_HOST}!</h1>
  //             <a href="${forgotPasswordLink}">${forgotPasswordLink}</a>
  //           </div>
  //         `
  //     })
  //   }
  // }
}
