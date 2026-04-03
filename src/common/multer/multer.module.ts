import { Module } from '@nestjs/common';
import { MulterModule as NestMulterModule } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';

// file uploads work even without these, but we add it any way just to satisfy the convention.
@Module({
  imports: [NestMulterModule.register(multerConfig)],
  exports: [NestMulterModule],
})
export class MulterModule {}
