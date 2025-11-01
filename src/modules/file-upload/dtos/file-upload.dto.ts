import { ApiProperty } from '@nestjs/swagger';
import { Folder } from '../constants/folders.file-upload';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

class FolderName {
  @ApiProperty({
    example: Folder.Profile,
    type: 'string',
    enum: Folder,
  })
  @IsEnum(Folder)
  @IsString()
  @IsNotEmpty()
  folder: string;
}

export class SingleFileUploadDto extends FolderName {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: any;
}

export class MultiFileUploadDto extends FolderName {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  files: any[];
}
