import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './post.entity';
import { GetPostsFilterDto } from './dto/get-posts-filter.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsRepository)
    private postsRepository: PostsRepository,
  ) {}

  createPost(createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsRepository.createPost(createPostDto);
  }

  getPosts(filterDto: GetPostsFilterDto): Promise<PostEntity[]> {
    return this.postsRepository.getPosts(filterDto);
  }
}
