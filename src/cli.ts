import { NestFactory } from '@nestjs/core';
import {
  CommandModule as NestCommandModule,
  CommandService,
} from 'nestjs-command';
import { CommandModule } from './command/command.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CommandModule);

  try {
    await app.select(NestCommandModule).get(CommandService).exec();
  } catch (error) {
    console.error(error);
    await app.close();
    process.exit(0);
  }
}

bootstrap();
