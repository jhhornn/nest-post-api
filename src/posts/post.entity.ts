import { User } from '../auth/user.entity';
import { Column, Entity, ManyToOne, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('posts')
export class PostEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;

  // @ManyToOne(() => User, (user) => user.posts)
  // user: User;
  @ObjectIdColumn({ name: 'user' })
  user!: ObjectID | PostEntity;
}
