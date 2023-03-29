import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PostEntity } from './post.entity';

@Injectable()
export class PostsRepository extends Repository<PostEntity> {
  constructor(private dataSource: DataSource) {
    super(PostEntity, dataSource.createEntityManager());
  }
}
