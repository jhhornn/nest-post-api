import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from '../posts/post.entity';
import { Factory } from 'nestjs-seeder';

@Entity()
export class User {
  @Factory((faker) => faker.datatype.uuid())
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Factory((faker) => faker.internet.email())
  @Column({ unique: true })
  email: string;

  @Factory((faker, ctx) => `${ctx.password}`)
  @Column()
  password: string;

  @Column({ default: '' })
  resetToken: string;

  // Eager true fetches the posts with the user (populate)
  @OneToMany((_type) => PostEntity, (post) => post.user, { eager: true })
  posts: PostEntity[];
}
