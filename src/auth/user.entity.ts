import { Column, Entity, ObjectID, ObjectIdColumn, OneToMany } from 'typeorm';
import { PostEntity } from '../posts/post.entity';

@Entity('users')
export class User {
  @ObjectIdColumn()
  id!: ObjectID;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  // @Column((type) => PostEntity)
  // posts!: ObjectID[];
  @ObjectIdColumn({ name: 'post', array: true })
  posts!: ObjectID[] | PostEntity[];
}
