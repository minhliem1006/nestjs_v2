import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule , ConfigService  } from '@nestjs/config';
//dang ki user moi sai duoc
@Module({
  imports:[TypeOrmModule.forFeature([User]),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      global: true,
      secret: configService.get<string>('SERECT'),
      signOptions: {
        expiresIn: configService.get<string>('EXP_IN_ACCESS_TOKEN'),
      },
    }),
    inject: [ConfigService],
  }),
  ConfigModule
],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
