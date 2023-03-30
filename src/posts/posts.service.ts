import { Injectable } from '@nestjs/common';
import {
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID } from 'mongodb';
import { User } from '../auth/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsFilterDto } from './dto/get-posts-filter.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './post.entity';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsRepository)
    private readonly postsRepository: PostsRepository,
  ) {}

  // create post service
  createPost(createPostDto: CreatePostDto, user: User): Promise<PostEntity> {
    return this.postsRepository.createPost(createPostDto, user);
  }

  // get post service
  getPosts(filterDto: GetPostsFilterDto, user: User): Promise<PostEntity[]> {
    // return this.postsRepository.getPosts(filterDto, user);
    const { search } = filterDto;
    if (search) {
      return this.postsRepository.find({
        where: { user: user.id, title: { $regex: search, $option: 'i' } },
        relations: { user: true },
        select: ['title', 'description', 'body'],
      });
    } else {
      return this.postsRepository.find({
        where: { user: user.id },
        relations: { user: true },
        select: ['title', 'description', 'body'],
      });
    }
  }

  // get post by id service
  async getPostById(id: string, user: User): Promise<PostEntity> {
    const isValidId = ObjectID.isValid(new ObjectID(id));
    const post = await this.postsRepository.findOne({
      where: { _id: new ObjectID(id) },
    });

    if (!isValidId && !post) {
      throw new NotFoundException(`Post with ID '${id}' not found`);
    }

    if (JSON.stringify(user.id) !== JSON.stringify(post.user)) {
      throw new UnauthorizedException(
        `You are not authorized to view this post`,
      );
    }

    return post;
  }

  // update post by id
  async updatePost(
    id: string,
    updatePost: UpdatePostDto,
    user: User,
  ): Promise<void> {
    const isValidId = ObjectID.isValid(new ObjectID(id));
    const foundPost = await this.postsRepository.findOne({
      where: { _id: new ObjectID(id) },
    });

    if (!isValidId && !foundPost) {
      throw new NotFoundException(`Post with ID '${id}' not found`);
    }

    if (JSON.stringify(user.id) !== JSON.stringify(foundPost.user)) {
      throw new UnauthorizedException(
        `You are not authorized to update this post`,
      );
    }

    await this.postsRepository.update(id, updatePost);
  }

  // delete a post by id
  async deletePost(id: string, user: User): Promise<void> {
    const isValidId = ObjectID.isValid(new ObjectID(id));
    const foundPost = await this.postsRepository.findOne({
      where: { _id: new ObjectID(id) },
    });

    if (!isValidId && !foundPost) {
      throw new NotFoundException(`Post with ID '${id}' not found`);
    }

    if (JSON.stringify(user.id) !== JSON.stringify(foundPost.user)) {
      throw new UnauthorizedException(
        `You are not authorized to update this post`,
      );
    }
    await this.postsRepository.delete(id);
  }
}
