import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { USER_ROLE } from '../constants/user.constant';
import { FileService } from 'src/modules/files/services/file.service';
import { Folder } from 'src/modules/files/constants/folders.file-upload';
import { FileEntity } from 'src/modules/files/entities/file.entity';
import { DataSource } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly fileService: FileService,
    private readonly dataSouce: DataSource,
  ) {}

  @Post('create')
  async getAllUsers(@Body() createUserDto: CreateUserDto) {
    createUserDto.role = USER_ROLE.USER;

    const queryRunner = this.dataSouce.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingUser = await this.usersService.findOneByEmail({
        email: createUserDto.email,
      });

      if (existingUser) {
        throw new ConflictException('email already taken');
      }

      const userRepo = queryRunner.manager.getRepository(UserEntity);
      const newlyCreatedUser = userRepo.create(createUserDto);

      await userRepo.save(newlyCreatedUser);

      let profilePicture: FileEntity | null = null;

      if (createUserDto.profilePictureId) {
        const profileImage = await this.fileService.getFileInfoOrError(
          createUserDto.profilePictureId,
        );

        if (profileImage.associationId || profileImage.associationType) {
          throw new ConflictException('image already used');
        }

        profilePicture = await queryRunner.manager
          .getRepository(FileEntity)
          .save({
            id: createUserDto.profilePictureId,
            associationId: newlyCreatedUser.id,
            associationType: Folder.Profile,
          });
      }

      await queryRunner.commitTransaction();

      // profilePicture = await this.fileService.getFileInfoOrError(
      //   createUserDto.profilePictureId,
      // );
      newlyCreatedUser['profilePicture'] =
        await this.fileService.getFileInfoOrError(
          createUserDto.profilePictureId,
        );

      return newlyCreatedUser;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
