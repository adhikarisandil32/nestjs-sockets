import {
  PutObjectCommand,
  type PutObjectCommandInput,
  type PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import { mimeTypes } from '../constants/aws.mime-types';

@Injectable()
export class AwsService {
  private readonly s3Client: S3Client;
  private readonly bucket: string | undefined;
  private readonly assetUrl: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get<string>('aws.accessKey')!,
        secretAccessKey: this.configService.get<string>('aws.secretKey')!,
      },
      region: this.configService.get<string>('aws.region')!,
      endpoint: this.configService.get<string>('aws.endpoint')!,
    });
    this.bucket = this.configService.get<string>('aws.bucketName')!;
    this.assetUrl = this.configService.get<string>('aws.assetUrl');
  }

  async putItemInBucket(
    content: string | Uint8Array | Buffer | Readable | ReadableStream | Blob,
    options: {
      path?: string;
      fileName: string;
    },
  ) {
    const key = options.path
      ? `${options.path}/${options.fileName}`
      : options.fileName;

    const mimeType: string = options.fileName
      .substring(options.fileName.lastIndexOf('.') + 1, options.fileName.length)
      .toUpperCase();

    const command: PutObjectCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: content,
      ContentType: mimeTypes[mimeType],
    });

    try {
      await this.s3Client.send<PutObjectCommandInput, PutObjectCommandOutput>(
        command,
      );
    } catch (error) {
      console.log(error);
      throw new BadRequestException('failed to upload images');
    }

    return;
  }
}
