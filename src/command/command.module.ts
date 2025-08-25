import { Module } from '@nestjs/common';
import {
  CommandService,
  CommandModule as NestCommandModule,
} from 'nestjs-command';
import { DatabaseModule } from 'src/common/database/database.module';
import { SeedDatabase } from './seed.command';
import { ConfigModule } from 'src/common/configs/config.module';

@Module({
  imports: [NestCommandModule, DatabaseModule, ConfigModule],
  providers: [CommandService, SeedDatabase],
})
export class CommandModule {}
