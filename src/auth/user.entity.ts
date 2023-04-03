import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from '../posts/post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: '' })
  resetToken: string;

  // Eager true fetches the posts with the user (populate)
  @OneToMany((_type) => PostEntity, (post) => post.user, { eager: true })
  posts: PostEntity[];
}
