import { Controller, Post, Body } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './post.entity';
import { PostsService } from './posts.service';

@Controller('api/v1/posts')
export class PostsController {
  // make postService available for use in controller class
  constructor(private postsService: PostsService) {}

  // Create Post
  @Post()
  createPost(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsService.createPost(createPostDto);
  }
}
