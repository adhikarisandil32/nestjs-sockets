import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

export function UploadFileSingle(field: string): MethodDecorator {
  return applyDecorators(UseInterceptors(FileInterceptor(field)));
}

export function UploadFilesMultiple(
  field: string,
  maxCount?: number,
): MethodDecorator {
  return applyDecorators(
    UseInterceptors(FilesInterceptor(field, maxCount ? Number(maxCount) : 10)),
  );
}
