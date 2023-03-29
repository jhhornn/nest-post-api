import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsFilterDto } from './dto/get-posts-filter.dto';
import { PostEntity } from './post.entity';

@Injectable()
export class PostsRepository extends Repository<PostEntity> {
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

  async getPosts(filterDto: GetPostsFilterDto): Promise<PostEntity[]> {
    const { search } = filterDto;
    // Refer to 'post' inside query
    const query = this.createQueryBuilder('post');

    // Search by post title or description given in query
    if (search) {
      query.andWhere(
        '(LOWER(post.title) LIKE LOWER(:search) OR LOWER(post.description) LIKE LOWER(:search))',
        { search: `%${search}%` }, // % helps to check match in pieces
      );
    }
    const posts = await query.getMany();
    return posts;
  }
}
