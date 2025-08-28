import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { SocketModule } from './socket/socket.module';
import { MemoryLoggerMiddleware } from './common/memory-logger/memory-logger.middleware';
import { AppRouterModule } from './router/router.module';

@Module({
  imports: [CommonModule, AppRouterModule, SocketModule],
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
