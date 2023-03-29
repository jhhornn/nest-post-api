import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt/dist';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UsersRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
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

  // async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
  //   const user = await this.usersRepository.findOne({
  //     where: { email: forgotPasswordDto.email },
  //   });
  //   if (!user) {
  //     throw new BadRequestException('User with this email was not found!');
  //   }
  //   const accessToken = await this.generateAccessToken(user.id, user.email);
  //   const forgotPasswordLink = `${process.env.CLIENT_HOST}/api/auth/forgot-password/${accessToken}`;
  //   await this.sendForgotPasswordLinkOnEmail(forgotPasswordLink, user.email);
  //   return {
  //     message:
  //       'We sent forgot password link on your email address! Please, check your email!',
  //   };
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
