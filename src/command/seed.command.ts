import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { DataSource } from 'typeorm';
import { seedUsers, seedGroups, seedGroupsUsers } from './seed-helper';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { GroupEntity } from 'src/modules/groups/entities/group.entity';

@Injectable()
export class SeedDatabase {
  constructor(private readonly _dataSource: DataSource) {}

  @Command({ command: 'db:seed' })
  async create() {
    const queryRunner = this._dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const usersRepository = queryRunner.manager.getRepository(UserEntity);
      const groupsRepository = queryRunner.manager.getRepository(GroupEntity);

      await seedUsers(usersRepository);
      await seedGroups(usersRepository, groupsRepository);
      await seedGroupsUsers(usersRepository, groupsRepository);

      console.log('seeding success');
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log('seeding failed, rolling back');
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
  }
}
