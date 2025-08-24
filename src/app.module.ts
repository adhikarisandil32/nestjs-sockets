import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { SocketModule } from './socket/socket.module';
import { GroupsModule } from './modules/groups/group.module';

@Module({
  imports: [CommonModule, GroupsModule, SocketModule],
  exports: [],
})
export class AppModule {}
