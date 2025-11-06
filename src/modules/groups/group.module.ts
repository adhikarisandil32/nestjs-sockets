import { Module } from '@nestjs/common';
import { GroupsService } from './services/group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import { FileModule } from '../files/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity]), FileModule],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
