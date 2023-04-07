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
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
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

  @ApiOperation({ description: 'Create comment' })
  @ApiBody({
    required: true,
    schema: {
      example: {
        title: 'Test title',
        description: 'This is us just testing the thing',
        body: 'Finally done testing',
      },
    },
  })
  @ApiOkResponse({ type: PostEntity })
  @ApiInternalServerErrorResponse({
    schema: {
      example: new InternalServerErrorException('Something went wrong!'),
    },
  })
  @ApiSecurity('bearer')
  // Create Post
  @Post()
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

  @ApiOkResponse({ type: [PostEntity] })
  @ApiOperation({ description: 'Get all comments' })
  @ApiInternalServerErrorResponse({
    schema: {
      example: new InternalServerErrorException('Something went wrong!'),
    },
  })
  @ApiSecurity('bearer')
  // Get posts
  @Get()
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

  @ApiOkResponse({ type: PostEntity })
  @ApiNotFoundResponse({
    schema: {
      example: new NotFoundException(`Comment with id was not found!`),
    },
  })
  @ApiSecurity('bearer')
  // Get posts by id
  @Get('/:id')
  getPostById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<PostEntity> {
    this.logger.verbose(`User ${user.email} retrieving post with id ${id}`);
    return this.postsService.getPostById(id, user);
  }

  @ApiOkResponse({ type: PostEntity })
  @ApiNotFoundResponse({
    schema: {
      example: new NotFoundException(
        `Comment with id was not updated! Access Denied!`,
      ),
    },
  })
  @ApiSecurity('bearer')
  // Update post
  @Put('/:id')
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

  @ApiOkResponse({})
  @ApiNotFoundResponse({
    schema: {
      example: new NotFoundException(
        `Comment with id was not deleted! Access Denied!`,
      ),
    },
  })
  @ApiSecurity('bearer')
  // Delete post
  @Delete('/:id')
  deletePost(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    this.logger.verbose(`User ${user.email} deleting post with id ${id}`);
    return this.postsService.deletePost(id, user);
  }
}
