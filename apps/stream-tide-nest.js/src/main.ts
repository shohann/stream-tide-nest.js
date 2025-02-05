import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true, // Enables auto-transformation
  //     whitelist: true, // Strips out unknown properties
  //   }),
  // );
  app.enableCors({
    origin: 'http://localhost:3000', // Change this to your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // Allow cookies/auth headers
  });
  await app.listen(5000);
}
bootstrap();
