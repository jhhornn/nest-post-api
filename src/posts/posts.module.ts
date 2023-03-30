import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from 'src/auth/users.repository';
import { AuthModule } from '../auth/auth.module';
import { PostEntity } from './post.entity';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), AuthModule],
  providers: [PostsService, PostsRepository, UsersRepository],
  controllers: [PostsController],
})
export class PostsModule {}
