import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { USER_ROLE } from '../constants/user.constant';
import { FileService } from 'src/modules/files/services/file.service';
import { Folder } from 'src/modules/files/constants/folders.file-upload';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly fileService: FileService,
  ) {}

  @Post('create')
  async getAllUsers(@Body() createUserDto: CreateUserDto) {
    createUserDto.role = USER_ROLE.USER;

    if (createUserDto.profilePictureId) {
      const profileImage = await this.fileService.getFileInfoOrError(
        createUserDto.profilePictureId,
      );

      if (profileImage.associationId || profileImage.associationType) {
        throw new ConflictException('image already used');
      }
    }

    const newlyCreatedUser = await this.usersService.createUser(createUserDto);

    if (createUserDto.profilePictureId) {
      await this.fileService.updateFileInfo(createUserDto.profilePictureId, {
        associationId: newlyCreatedUser.id,
        associationType: Folder.Profile,
      });
    }

    return newlyCreatedUser;
  }
}
