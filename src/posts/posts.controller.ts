import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreatePostDto, SuccessCreatePost } from './dto/create-post.dto';
import { GetPostsFilterDto } from './dto/get-posts-filter.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './post.entity';
import { PostsService } from './posts.service';

@ApiTags('Posts')
@Controller('api/v1/posts')
// protect all post routes
@UseGuards(AuthGuard())
export class PostsController {
  private logger = new Logger('PostsController', { timestamp: true });
  // make postService available for use in controller class
  constructor(private postsService: PostsService) {}

  @ApiOperation({
    description: 'Creates post',
    summary:
      'If you want to create a post, use this route. It takes no query params',
  })
  @ApiBody({
    required: true,
    type: CreatePostDto,
    description: 'Create Post',
  })
  @ApiSecurity('bearer')

  // Create Post
  @Post()
  @ApiCreatedResponse({
    type: SuccessCreatePost,
    description: 'Post created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      example: new BadRequestException('Bad request'),
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    schema: {
      example: new UnauthorizedException('You are not authorized'),
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    schema: {
      example: new InternalServerErrorException('Something went wrong!'),
    },
  })
  createPost(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: User,
  ): Promise<PostEntity> {
    this.logger.verbose(
      `User "${user.email}" creating a new post. Data: ${JSON.stringify(
        createPostDto,
      )}`,
    );
    return this.postsService.createPost(createPostDto, user);
  }

  @ApiOperation({
    description: 'Get all posts',
    summary:
      'If you want to get all posts, use this route. It takes an optional title query params',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      example: new InternalServerErrorException('Something went wrong!'),
    },
  })
  @ApiSecurity('bearer')
  // Get posts
  @Get()
  @ApiQuery({ name: 'title', required: false })
  @ApiOkResponse({ type: SuccessCreatePost, isArray: true })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    schema: {
      example: new UnauthorizedException('You are not authorized'),
    },
  })
  getPosts(
    @Query() filterDto: GetPostsFilterDto,
    @GetUser() user: User,
  ): Promise<PostEntity[]> {
    this.logger.verbose(
      `User ${user.email} retrieving all posts. Filters: ${JSON.stringify(
        filterDto,
      )}`,
    );
    return this.postsService.getPosts(filterDto, user);
  }

  @ApiOperation({
    description: 'Get post by id',
    summary: 'If you want to get a post by id, use this route. It takes param',
  })
  @ApiSecurity('bearer')
  // Get posts by id
  @Get('/:id')
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: SuccessCreatePost })
  @ApiNotFoundResponse({
    schema: {
      example: new NotFoundException(`post with id was not found!`),
    },
  })
  getPostById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<PostEntity> {
    this.logger.verbose(`User ${user.email} retrieving post with id ${id}`);
    return this.postsService.getPostById(id, user);
  }

  @ApiOperation({
    description: 'Update post by id',
    summary:
      'If you want to update a post by id, use this route. It takes param',
  })
  @ApiSecurity('bearer')
  // Update post
  @Put('/:id')
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: SuccessCreatePost })
  @ApiNotFoundResponse({
    schema: {
      example: new NotFoundException(`post with id was not found!`),
    },
  })
  updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @GetUser() user: User,
  ): Promise<PostEntity> {
    this.logger.verbose(
      `User ${user.email} updating post with id ${id}. Data: ${JSON.stringify(
        updatePostDto,
      )}`,
    );
    return this.postsService.updatePost(id, updatePostDto, user);
  }

  @ApiOperation({
    description: 'Delete post by id',
    summary:
      'If you want to delete a post by id, use this route. It takes param',
  })
  @ApiSecurity('bearer')
  // Delete post
  @Delete('/:id')
  @ApiParam({ name: 'id' })
  @ApiOkResponse({})
  @ApiNotFoundResponse({
    schema: {
      example: new NotFoundException(`post with id was not found!`),
    },
  })
  deletePost(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    this.logger.verbose(`User ${user.email} deleting post with id ${id}`);
    return this.postsService.deletePost(id, user);
  }
}
