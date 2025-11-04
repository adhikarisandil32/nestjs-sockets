import { FindOneOptions, Repository } from 'typeorm';
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

  async findOne(options: FindOneOptions<FileEntity>) {
    return await this.fileRepo.findOne(options);
  }

  async findOneOrError(options: FindOneOptions<FileEntity>) {
    const fileInfo = await this.fileRepo.findOne(options);

    if (!fileInfo) {
      throw new NotFoundException('file not found');
    }

    return fileInfo;
  }

  async updateFileInfo(
    id: number,
    infoToUpdate: { associationId: number; associationType: Folder },
  ) {
    const existingFile = await this.findOneOrError({
      where: {
        id,
      },
    });

    existingFile.associationId = infoToUpdate.associationId;
    existingFile.associationType = infoToUpdate.associationType;

    return await this.fileRepo.save(existingFile);
  }
}
