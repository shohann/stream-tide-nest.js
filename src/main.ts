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
  await app.listen(3000);
}
bootstrap();
