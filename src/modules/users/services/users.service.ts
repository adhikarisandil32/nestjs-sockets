import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async getAllUsers() {
    return await this.userRepo.find({
      where: {
        isActive: true,
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

  async findOneByEmail({ email }: { email: string }) {
    return await this.userRepo.findOne({ where: { email } });
  }
}
