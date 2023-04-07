import { Injectable, Logger } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { DataSource, Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsFilterDto } from './dto/get-posts-filter.dto';
import { PostEntity } from './post.entity';

@Injectable()
export class PostsRepository extends Repository<PostEntity> {
  private logger = new Logger('TasksRepository', { timestamp: true });

  constructor(private dataSource: DataSource) {
    super(PostEntity, dataSource.createEntityManager());
  }

  async createPost(
    createPostDto: CreatePostDto,
    user: User,
  ): Promise<PostEntity> {
    const { title, body, description } = createPostDto;

    const post = this.create({
      title,
      description,
      body,
      user,
    });

    await this.save(post);
    return post;
  }

  async getPosts(
    filterDto: GetPostsFilterDto,
    user: User,
  ): Promise<PostEntity[]> {
    const { search } = filterDto;
    // Refer to 'post' inside query
    const query = this.createQueryBuilder('post');
    query.where({ user });

    // Search by post title or description given in query
    if (search) {
      query.andWhere(
        '(LOWER(post.title) LIKE LOWER(:search) OR LOWER(post.description) LIKE LOWER(:search))',
        { search: `%${search}%` }, // % helps to check match in pieces
      );
    }
    try {
      const posts = await query.getMany();
      return posts;
    } catch (err) {
      this.logger.error(
        `Failed to get tasks for user "${user.email}". Filter: ${JSON.stringify(
          filterDto,
        )}`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
