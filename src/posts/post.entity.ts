import { User } from '../auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Factory } from 'nestjs-seeder';

@Entity()
export class PostEntity {
  @Factory((faker) => faker.datatype.uuid())
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Factory((faker) => faker.lorem.words(8))
  @Column()
  title: string;

  @Factory((faker) => faker.lorem.sentences())
  @Column()
  description: string;

  @Factory((faker) => faker.lorem.paragraphs())
  @Column()
  body: string;

  @Factory((faker, ctx) => `${ctx.user}`)
  @ManyToOne((_type) => User, (user) => user.posts, { eager: false })
  // exclude this field when returning when post is requested for
  @Exclude({ toPlainOnly: true })
  user: User;
}
