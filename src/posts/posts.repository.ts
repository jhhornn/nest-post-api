import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './post.entity';

@Injectable()
export class PostsRepository extends Repository<PostEntity> {
  constructor(private dataSource: DataSource) {
    super(PostEntity, dataSource.createEntityManager());
  }

  async createPost(createPostDto: CreatePostDto): Promise<PostEntity> {
    const { title, body, description } = createPostDto;

    const post = this.create({
      title,
      description,
      body,
    });

    await this.save(post);
    return post;
  }
}
