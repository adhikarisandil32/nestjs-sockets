import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsService } from 'src/common/aws/services/aws.service';
import { FileEntity } from '../entities/file.entity';
import { Folder } from '../constants/folders.file-upload';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepo: Repository<FileEntity>,
    private readonly awsService: AwsService,
  ) {}

  async addFile(
    file: Express.Multer.File,
    fileOptions: { path?: string; fileName: string },
  ) {
    const content: Buffer = file.buffer;

    await this.awsService.putItemInBucket(content, fileOptions);

    const addedFile = this.fileRepo.create({
      path: fileOptions.path,
      fileName: fileOptions.fileName,
    });

    await this.fileRepo.save(addedFile);

    return addedFile;
  }
}
