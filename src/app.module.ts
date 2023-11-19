import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './user/entities/user.entity';
import { dataSourceOptions } from 'db/data-source';
@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}