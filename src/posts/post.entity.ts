import { User } from '../auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @ManyToOne((_type) => User, (user) => user.posts, { eager: false })
  // exclude this field when returning when post is requested for
  @Exclude({ toPlainOnly: true })
  user: User;
}
