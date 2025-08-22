import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { DataSource } from 'typeorm';

@Injectable()
export class SeedDatabase {
  constructor(private readonly _dataSource: DataSource) {}

  @Command({ command: 'seed:db' })
  async create() {
    console.log('seeding DB start');
    console.log('seeding DB done');
  }
}
