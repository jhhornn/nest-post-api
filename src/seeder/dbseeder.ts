// import { Injectable } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Command } from 'commander';
// // import * as faker from 'faker';
// import { Repository } from 'typeorm';
// import { AppModule } from '../app.module';
// import { User } from '../auth/user.entity';
// import { PostEntity } from '../posts/post.entity';
// @Injectable()
// export class DatabaseSeeder {
//   constructor(
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//     @InjectRepository(PostEntity)
//     private readonly postRepository: Repository<PostEntity>,
//   ) {}

//   async seed(numUsers: number, numPosts: number) {
//     // Seed users
//     const users = [];
//     for (let i = 0; i < numUsers; i++) {
//       const user = new User();
//       user.email = faker.internet.email();
//       user.password = faker.internet.password();
//       users.push(user);
//     }
//     await this.userRepository.save(users);

//     const posts = [];
//     for (let i = 0; i < numPosts; i++) {
//       const post = new PostEntity();
//       post.title = faker.lorem.sentence();
//       post.description = faker.lorem.sentence();
//       post.body = faker.lorem.paragraphs();
//       posts.push(post);
//     }
//     await this.postRepository.save(posts);
//   }
// }

// // Create the command line interface
// const program = new Command();

// // Define the command
// program
//   .option('-u, --users <number>', 'Number of users to seed')
//   .option('-p, --posts <number>', 'Number of posts to seed')
//   .action(async (options) => {
//     const numUsers = options.users || 10;
//     const numPosts = options.posts || 20;

//     // Create the app and run the seeder
//     const app = await NestFactory.createApplicationContext(AppModule);
//     const seeder = app.get(DatabaseSeeder);
//     await seeder.seed(numUsers, numPosts);

//     // Close the app
//     await app.close();
//   });

// // Parse the command line arguments
// program.parse(process.argv);
