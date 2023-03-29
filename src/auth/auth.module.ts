import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersRepository } from './users.repository';

@Module({
  providers: [AuthService, UsersRepository],
  controllers: [AuthController],
})
export class AuthModule {}
