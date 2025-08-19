import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('NestApplication');

  const app = await NestFactory.create<NestApplication>(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('app.port') ?? 3000;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app
    .listen(port)
    .then(() => logger.log(`App Listening to Port ${port}`));
}
bootstrap();
