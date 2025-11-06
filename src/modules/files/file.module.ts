import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsModule } from 'src/common/aws/aws.module';
import { FileEntity } from './entities/file.entity';
import { FileService } from './services/file.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), AwsModule],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
