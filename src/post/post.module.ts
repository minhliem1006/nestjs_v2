import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post } from './entities/post.entity';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User, Post , Category]),ConfigModule,JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      global: true,
      secret: configService.get<string>('SERECT'),
      signOptions: {
        expiresIn: configService.get<string>('EXP_IN_ACCESS_TOKEN'),
      },
    }),
    inject: [ConfigService],
  }),],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
