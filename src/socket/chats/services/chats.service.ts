import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(private readonly _dataSource: DataSource) {}

  async loadGroupsAndRooms() {}
}
