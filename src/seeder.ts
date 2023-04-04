import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { seeder } from 'nestjs-seeder';
import { User } from './auth/user.entity';
import { PostEntity } from './posts/post.entity';
import { Seeders } from './seeder/seeders';

seeder({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
        };
      },
    }),
    TypeOrmModule.forFeature([User, PostEntity]),
  ],
}).run([Seeders]);
