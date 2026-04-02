import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {}

  async validate(value: any) {}
}
