import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';
import { ObjectID } from 'mongodb';

const mockPostsRepository = () => ({
  getPosts: jest.fn(),
  findOne: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
});

const mockUser = {
  id: 'random-id',
  email: 'TestingTest@mail.com',
  password: 'testingPassword123*',
  posts: [new ObjectID('random')],
};

describe('PostsService', () => {
  let postsService: PostsService;
  let postsRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: PostsRepository, useFactory: mockPostsRepository },
      ],
    }).compile();

    postsService = module.get(PostsService);
    postsRepository = module.get(PostsRepository);
  });

  describe('POST /api/v1/posts', () => {
    it('should call PostsRepository.createPost', async () => {
      const mockPost = {
        title: 'Testing',
        description: 'Testing Post By ID',
        body: ' should be succeess',
        user: mockUser,
      };
      postsRepository.createPost.mockResolvedValue('posted!');
      const result = await postsService.createPost(mockPost, mockUser);
      expect(result).toEqual('posted!');
    });
  });

  describe('GET /api/v1/posts', () => {
    it('should call PostsRepository.getPosts and return all post', async () => {
      postsRepository.getPosts.mockResolvedValue('gotten!');
      const result = await postsService.getPosts(null, mockUser);
      expect(result).toEqual('gotten!');
    });
  });

  describe('GET /api/v1/posts/:id', () => {
    it('should call PostsRepository.findOne and return the result', async () => {
      const mockPost = {
        title: 'Testing',
        description: 'Testing Post By ID',
        body: ' should be succeess',
      };

      postsRepository.findOne.mockResolvedValue(mockPost);
      const result = await postsService.getPostById('testId', mockUser);
      expect(result).toEqual(mockPost);
    });

    it('should call PostsRepository.findOne and handles error', async () => {
      postsRepository.findOne.mockResolvedValue(null);
      expect(postsService.getPostById('testId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
