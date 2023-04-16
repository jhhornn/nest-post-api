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

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  private logger = new Logger('AuthController', { timestamp: true });
  constructor(private authService: AuthService) {}

  @ApiOperation({
    description: 'User Signup',
    summary: 'Users can signup using email and password',
  })
  @ApiBody({
    required: true,
    type: AuthCredentialsDto,
  })
  // signup users
  @Post('/signup')
  @ApiConflictResponse({
    schema: { example: new ConflictException('email already exists!') },
  })
  @ApiOkResponse({ description: 'User successfully created' })
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    this.logger.verbose(
      `User trying to signup with mail ${authCredentialsDto.email}`,
    );
    return this.authService.signUp(authCredentialsDto);
  }

  @ApiOperation({
    description: 'User Signin',
    summary: 'Users can signin using their email and password',
  })
  @ApiBody({
    required: true,
    type: LoginCredentialsDto,
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: new UnauthorizedException('Please check your login credentials'),
    },
  })
  @ApiOkResponse({
    description: 'JWT for authorization',
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

  @ApiOperation({
    description: 'User forgot password',
    summary:
      'Users can generate unique token which expires after 10mins to change their password',
  })
  @ApiBody({
    required: true,
    type: ForgotPasswordDto,
  })
  @ApiOkResponse({
    description: 'JWT for changing password',
    schema: {
      example: {
        resetToken: `token string`,
      },
    },
  })
  @Post('/forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @ApiOperation({
    description: 'User reset password',
    summary:
      'Users can change their password using the token generated from /forgot-password route',
  })
  @ApiBody({
    required: true,
    type: ResetPasswordDto,
  })
  @ApiOkResponse({
    description: 'Password reset!',
  })
  @Post('/reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<any> {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
