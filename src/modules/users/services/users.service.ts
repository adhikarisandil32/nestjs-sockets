import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly _dataSource: DataSource,
  ) {}

  async getAllUsers() {
    return await this.userRepo.find({});
  }

  async findOneById(id: number) {
    return await this.userRepo.findOne({
      where: {
        id,
      },
    });
  }

  async findOneByEmail({ email }: { email: string }) {
    return await this.userRepo.findOne({ where: { email } });
  }
}
