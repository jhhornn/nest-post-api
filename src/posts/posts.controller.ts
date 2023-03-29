import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsFilterDto } from './dto/get-posts-filter.dto';
import { UpdatePostDto } from './dto/update-post.dto';
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

  // Get posts
  @Get()
  getPosts(@Query() filterDto: GetPostsFilterDto): Promise<PostEntity[]> {
    return this.postsService.getPosts(filterDto);
  }

  // Get posts by id
  @Get('/:id')
  getPostById(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.getPostById(id);
  }

  // Update post
  @Put('/:id')
  updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.updatePost(id, updatePostDto);
  }

  // Delete post
  @Delete('/:id')
  deletePost(@Param('id') id: string): Promise<void> {
    return this.postsService.deletePost(id);
  }
}
