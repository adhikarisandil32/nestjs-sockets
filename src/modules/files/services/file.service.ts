import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
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

    const uploadedFile = await this.awsService.putItemInBucket(
      content,
      fileOptions,
    );

    const addedFile = this.fileRepo.create(uploadedFile);

    await this.fileRepo.save(addedFile);

    return addedFile;
  }

  async getFileInfoOrError(id: number) {
    const fileInfo = await this.fileRepo.findOne({
      where: {
        id,
      },
    });

    if (!fileInfo) {
      throw new NotFoundException('file not available');
    }

    return fileInfo;
  }

  async updateFileInfo(
    id: number,
    infoToUpdate: { associationId: number; associationType: Folder },
  ) {
    const existingFile = await this.getFileInfoOrError(id);

    existingFile.associationId = infoToUpdate.associationId;
    existingFile.associationType = infoToUpdate.associationType;

    return await this.fileRepo.save(existingFile);
  }
}
