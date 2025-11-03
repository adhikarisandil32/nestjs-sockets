import {
  Body,
  Controller,
  Get,
  Param,
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
import { FileService } from '../services/file.service';

@ApiTags('File Uploads')
@Controller('file')
export class FileController {
  constructor(private readonly fileUploadService: FileService) {}

  @Post('image/upload')
  @UploadFileSingle('file')
  @ApiConsumes('multipart/form-data')
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() fileInfo: SingleFileUploadDto,
  ) {
    const fileExtension = file.originalname.split('.')?.at(-1);
    const randomName = crypto.randomUUID();

    const addedFile = await this.fileUploadService.addFile(file, {
      path: fileInfo.folder,
      fileName: `${randomName}.${fileExtension}`,
    });

    return addedFile;
  }

  @Post('images/uploads')
  @UploadFilesMultiple('files')
  @ApiConsumes('multipart/form-data')
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() filesInfo: MultiFileUploadDto,
  ) {}

  @Get('images/:id')
  async getImage(@Param('id') id: number) {
    return await this.fileUploadService.getFileInfoOrError(id);
  }
}
