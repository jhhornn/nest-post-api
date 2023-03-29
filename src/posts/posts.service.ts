import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
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
    private postsRepository: PostsRepository,
  ) {}

  // create post service
  createPost(createPostDto: CreatePostDto, user: User): Promise<PostEntity> {
    return this.postsRepository.createPost(createPostDto, user);
  }

  // get post service
  getPosts(filterDto: GetPostsFilterDto, user: User): Promise<PostEntity[]> {
    return this.postsRepository.getPosts(filterDto, user);
  }

  // get post by id service
  async getPostById(id: string, user: User): Promise<PostEntity> {
    const foundPost = await this.postsRepository.findOne({
      where: { id, user },
    });

    if (!foundPost) {
      throw new NotFoundException(`Post with ID '${id}' not found`);
    }

    return foundPost;
  }

  // update post by id
  async updatePost(
    id: string,
    updatePost: UpdatePostDto,
    user: User,
  ): Promise<PostEntity> {
    const foundPost = await this.postsRepository.findOne({
      where: { id, user },
    });

    if (!foundPost) {
      throw new NotFoundException(`Post with ID '${id}' not found`);
    }

    const { title, description, body } = updatePost;
    foundPost.title = title || foundPost.title;
    foundPost.description = description || foundPost.description;
    foundPost.body = body || foundPost.body;

    await this.postsRepository.save(foundPost);

    return foundPost;
  }

  // delete a post by id
  async deletePost(id: string, user: User): Promise<void> {
    const toDelete = await this.postsRepository.delete({ id, user });
    if (toDelete.affected === 0) {
      throw new NotFoundException(`Post with ID '${id}' not found`);
    }
  }
}
