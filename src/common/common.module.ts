import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './configs/config.module';

@Module({
  imports: [ConfigModule, DatabaseModule],
  exports: [],
})
export class CommonModule {}
