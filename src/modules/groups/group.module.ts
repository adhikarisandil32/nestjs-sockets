import { Module } from '@nestjs/common';
import { GroupsService } from './services/group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity])],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
