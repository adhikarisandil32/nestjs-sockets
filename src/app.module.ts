import {
  Module,
  // MiddlewareConsumer,
  // NestModule,
  // RequestMethod,
} from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { SocketModule } from './socket/socket.module';
import { AppRouterModule } from './router/router.module';
// import { MemoryLoggerMiddleware } from './common/memory-logger/memory-logger.middleware';

@Module({
  imports: [CommonModule, AppRouterModule, SocketModule],
  exports: [],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(MemoryLoggerMiddleware).forRoutes({
//       path: '/api/*',
//       method: RequestMethod.ALL,
//     });
//   }
// }
