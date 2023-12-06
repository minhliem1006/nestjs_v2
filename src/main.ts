import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication  } from '@nestjs/platform-express'; // static file
async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //swagger
  const config = new DocumentBuilder()
  .setTitle("Blog api")
  .setDescription("list api for simple blog by Liem")
  .setVersion("1.0")
  .addTag("Auth")
  .addTag("User")
  .addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup("api",app,document);
  //swagger
  app.enableCors();
  //static file
  app.useStaticAssets(join(__dirname,'../../uploads'));
  await app.listen(5000);
}
bootstrap();
