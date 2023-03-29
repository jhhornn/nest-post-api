import { Controller } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('api/v1/posts')
export class PostsController {
  // make postService available for use in controller class
  constructor(private postService: PostsService) {}
}
