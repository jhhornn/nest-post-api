import { PostEntity } from 'src/posts/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  // Eager true fetches the posts with the user (populate)
  @OneToMany((_type) => PostEntity, (post) => post.user, { eager: true })
  posts: PostEntity[];
}
