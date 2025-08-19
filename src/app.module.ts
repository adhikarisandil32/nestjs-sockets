import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [CommonModule, SocketModule],
  exports: [],
})
export class AppModule {}
