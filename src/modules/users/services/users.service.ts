import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { DataSource, In, Repository } from 'typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { UserGroupEntity } from 'src/modules/users-groups/entities/users-groups.entity';
import { ICreateUser } from '../interfaces/create-user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly _dataSource: DataSource,
  ) {}

  async createUser(createUserDto: ICreateUser) {
    const exisitingUser = await this.userRepo.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (exisitingUser) {
      throw new ConflictException('email already taken');
    }

    const user = this.userRepo.create(createUserDto);

    await this.userRepo.save(user);

    return user;
  }

  async getAllUsers() {
    return await this.userRepo.find({
      where: {
        isActive: true,
      },
    });
  }

  async getUsersByIds(userIds: number[]) {
    return await this.userRepo.find({
      where: {
        id: In(userIds),
      },
    });
  }

  async findOneById(id: number) {
    return await this.userRepo.findOne({
      where: {
        id,
        isActive: true,
      },
    });
  }

  async findGroups(userId: number) {
    // const userGroups = await this.userRepo.find({
    //   where: {
    //     id: userId,
    //   },
    //   relations: {
    //     groups: {
    //       group: true,
    //     },
    //   },
    //   select: {
    //     groups: {
    //       group: {
    //         id: true,
    //         name: true,
    //       },
    //     },
    //   },
    // });

    // return userGroups;
    const userGroups = await this._dataSource
      .getRepository(UserGroupEntity)
      .find({
        where: {
          member: {
            id: userId,
          },
        },
        relations: {
          group: true,
        },
        select: {
          group: {
            id: true,
            name: true,
          },
        },
      });

    return userGroups;
  }

  async findOneByEmail({ email }: { email: string }) {
    return await this.userRepo.findOne({ where: { email } });
  }
}
