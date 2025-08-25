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
  app.setGlobalPrefix('api');

  // to monitor the nestapp's process memory
  // setInterval(() => {
  //   const processMemory = process.memoryUsage();

  //   console.log({
  //     rss: `${Math.ceil(processMemory.rss / (1024 * 1024))} MB`,
  //     heapTotal: `${Math.ceil(processMemory.heapTotal / (1024 * 1024))} MB`,
  //     heapUsed: `${Math.ceil(processMemory.heapUsed / (1024 * 1024))} MB`,
  //     external: `${Math.ceil(processMemory.external / (1024 * 1024))} MB`,
  //     time: Date.now(),
  //   });
  // }, 5000);

  await app
    .listen(port)
    .then(() => logger.log(`App Listening to Port ${port}`));
}
bootstrap();
