import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[TypeOrmModule.forFeature([User]),ConfigModule,JwtModule.registerAsync({
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
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
