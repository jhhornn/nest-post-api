import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { User } from '../auth/user.entity';
import { UsersRepository } from '../auth/users.repository';
import { PostEntity } from '../posts/post.entity';
import { PostsRepository } from '../posts/posts.repository';

@Injectable()
export class Seeders implements Seeder {
  constructor(
    @InjectRepository(User) private readonly user: UsersRepository,
    @InjectRepository(PostEntity) private readonly post: PostsRepository,
  ) {}

  async seed(): Promise<any> {
    // You can add the value of password manually
    const password = 'Secret1234*';
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const numOfUsers = 5;
    // Generate 10 users using the above hashed password
    const users = DataFactory.createForClass(User).generate(numOfUsers, {
      password: hashedPassword,
    });
    console.log(users);

    // Insert into the database.
    const userEnitities = this.user.create(users);
    await this.user.insert(userEnitities);
    console.log(userEnitities);

    // Generate random index to be assigned to the posts user
    function getRandomIndex(array) {
      return Math.floor(Math.random() * array.length);
    }

    const numOfPosts = 10;

    for (let i = 0; i < numOfPosts; i++) {
      const randomIndex = getRandomIndex(userEnitities);
      const posts = DataFactory.createForClass(PostEntity).generate(
        numOfPosts,
        { user: userEnitities[randomIndex].id },
      );
      const postEnitities = this.post.create(posts);
      await this.post.insert(postEnitities);
      return postEnitities;
    }
    return users;
  }

  async drop(): Promise<any> {
    return this.user.delete({}), this.post.delete({});
  }
}
