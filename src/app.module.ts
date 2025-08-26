import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { SocketModule } from './socket/socket.module';
import { GroupsModule } from './modules/groups/group.module';
import { MemoryLoggerMiddleware } from './common/memory-logger/memory-logger.middleware';

@Module({
  imports: [CommonModule, GroupsModule, SocketModule],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MemoryLoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
