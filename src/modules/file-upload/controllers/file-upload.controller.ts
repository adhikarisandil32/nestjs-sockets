import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  MultiFileUploadDto,
  SingleFileUploadDto,
} from '../dtos/file-upload.dto';
import {
  UploadFileSingle,
  UploadFilesMultiple,
} from '../decorators/file-upload.decorator';

@ApiTags('File Uploads')
@Controller('file')
export class FileUploadController {
  constructor() {}

  @Post('image/upload')
  @UploadFileSingle('file')
  @ApiConsumes('multipart/form-data')
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() fileInfo: SingleFileUploadDto,
  ) {}

  @Post('images/uploads')
  @UploadFilesMultiple('files')
  @ApiConsumes('multipart/form-data')
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() filesInfo: MultiFileUploadDto,
  ) {}
}
