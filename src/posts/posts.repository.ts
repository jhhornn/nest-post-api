import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { DataSource, getMongoManager, MongoRepository } from 'typeorm';
import { User } from '../auth/user.entity';
import { UsersRepository } from '../auth/users.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsFilterDto } from './dto/get-posts-filter.dto';
import { PostEntity } from './post.entity';

@Injectable()
export class PostsRepository extends MongoRepository<PostEntity> {
  constructor(
    private dataSource: DataSource,
    private userRepository: UsersRepository,
  ) {
    super(PostEntity, dataSource.createEntityManager());
  }

  async createPost(
    createPostDto: CreatePostDto,
    user: User,
  ): Promise<PostEntity> {
    const userFound = await this.userRepository.findOne({
      where: { _id: user.id.valueOf() },
      select: ['id', 'email', 'posts'],
    });
    console.log(userFound);
    if (!userFound) {
      throw new UnauthorizedException('You are not authorized');
    }
    const { title, body, description } = createPostDto;

    const post = new PostEntity();
    post.title = title;
    post.description = description;
    post.body = body;
    post.user = userFound.id;

    try {
      await this.save(post);

      await this.userRepository.updateOne(
        { _id: user.id.valueOf() }, // filter for the user to update
        { $addToSet: { posts: post.id } }, // add the post ID to the 'posts' array
      );

      return post;
    } catch (err) {
      console.error(err);
    }
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
    const posts = await query.getMany();
    return posts;
  }
}
