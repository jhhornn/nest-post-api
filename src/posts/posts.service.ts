import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsFilterDto } from './dto/get-posts-filter.dto';
import { PostEntity } from './post.entity';
import { PostsRepository } from './posts.repository';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsRepository)
    private postsRepository: PostsRepository,
  ) {}

  // create post service
  createPost(createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsRepository.createPost(createPostDto);
  }

  // get post service
  getPosts(filterDto: GetPostsFilterDto): Promise<PostEntity[]> {
    return this.postsRepository.getPosts(filterDto);
  }

  // get post by id service
  async getPostById(id: string): Promise<PostEntity> {
    const foundPost = await this.postsRepository.findOne({ where: { id: id } });

    if (!foundPost) {
      throw new NotFoundException(`Post with ID '${id}' not found`);
    }

    return foundPost;
  }

  // update post by id
  async updatePost(id: string, updatePost: UpdatePostDto): Promise<PostEntity> {
    const foundPost = await this.postsRepository.findOne({
      where: { id },
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
}
