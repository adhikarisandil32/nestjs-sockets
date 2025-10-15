import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ConversationReadModule])],
  providers: [],
  exports: [],
})
export class ConversationReadModule {}
