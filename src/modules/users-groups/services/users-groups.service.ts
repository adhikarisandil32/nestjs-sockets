import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersGroupsService {
  constructor() {}

  async create(createUserGroup: any) {
    console.log(createUserGroup);
  }
}
