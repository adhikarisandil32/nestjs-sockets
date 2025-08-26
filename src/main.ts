import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

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

  if (configService.get<string>('app.mode') !== 'production') {
    // to monitor the nestapp's process memory
    try {
      setInterval(() => {
        const processMemory = process.memoryUsage();

        // if memory exceeds 500MB, log the memory info
        if (processMemory.rss > 500 * 1024 * 1024) {
          const processMemoryInMb = {
            datetime: Date.now(),
            rss: `${(processMemory.rss / (1024 * 1024)).toFixed(2)} MB`,
            heapTotal: `${(processMemory.heapTotal / (1024 * 1024)).toFixed(2)} MB`,
            heapUsed: `${(processMemory.heapUsed / (1024 * 1024)).toFixed(2)} MB`,
            external: `${(processMemory.external / (1024 * 1024)).toFixed(2)} MB`,
            arrayBuffers: `${(processMemory.arrayBuffers / (1024 * 1024)).toFixed(2)} MB`,
          };

          fs.appendFile(
            './app_memory_usage_logs.txt',
            ', ' + JSON.stringify(processMemoryInMb),
            () => null,
          );
        }
      }, 1000);
    } catch (error) {
      console.log(new Error(error));
    }
  }

  await app
    .listen(port)
    .then(() => logger.log(`App Listening to Port ${port}`));
}

bootstrap();
