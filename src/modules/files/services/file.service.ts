import { FindOneOptions, In, Repository } from 'typeorm';
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

  // not used for keep for type safety: also url: https://chatgpt.com/share/690b3fd4-48f4-8010-8f7a-1771d435956f

  // async attachFilesToEntityResponse<T, K extends string>(args: {
  //   keyForFile: K;
  //   entityFindResponse: T;
  //   associationIds: number[];
  //   associationType: Folder;
  // }): Promise<T & { [key in K]: FileEntity | null }> {
  //   const files = await this.fileRepo.findOne({
  //     where: {
  //       associationId: In(args.associationIds),
  //       associationType: args.associationType,
  //     },
  //   });

  //   (args.entityFindResponse as any)[args.keyForFile] = files;

  //   return args.entityFindResponse as T & { [key in K]: FileEntity | null };
  // }
}
