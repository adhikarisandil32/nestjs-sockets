import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { DataSource } from 'typeorm';
import { seedUsers, seedGroups } from './seed-helper';
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
      console.log('seeding begins');

      await seedUsers(queryRunner.manager.getRepository(UserEntity));
      await seedGroups(
        queryRunner.manager.getRepository(UserEntity),
        queryRunner.manager.getRepository(GroupEntity),
      );

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
