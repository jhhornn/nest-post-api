import { Body, Controller, Logger, Post } from '@nestjs/common';
import {
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import {
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginCredentialsDto } from './dto/login-credential.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from './user.entity';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  private logger = new Logger('AuthController', { timestamp: true });
  constructor(private authService: AuthService) {}

  @ApiOperation({ description: 'User Signup' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        email: 'test@gmail.com',
        password: 'Qwerty123*',
      },
    },
  })
  @ApiConflictResponse({
    schema: { example: new ConflictException('email already exists!') },
  })
  @ApiOkResponse({ description: '', type: User })
  // signup users
  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    this.logger.verbose(
      `User trying to signup with mail ${authCredentialsDto.email}`,
    );
    return this.authService.signUp(authCredentialsDto);
  }

  @ApiOperation({ description: 'User Signin' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        email: 'test@gmail.com',
        password: 'Qwerty123*',
      },
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: new UnauthorizedException('Please check your login credentials'),
    },
  })
  @ApiOkResponse({
    description: 'token: Token',
    schema: {
      example: {
        accessToken: `Access token string`,
      },
    },
  })
  // signin users
  @Post('/signin')
  signIn(
    @Body() loginCredentialsDto: LoginCredentialsDto,
  ): Promise<{ accessToken: string }> {
    this.logger.verbose(`${loginCredentialsDto.email} trying to signin`);
    return this.authService.signIn(loginCredentialsDto);
  }

  @Post('/forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('/reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<any> {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
