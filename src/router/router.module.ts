import { Module } from '@nestjs/common';
import { RouterModule as NestRouter } from '@nestjs/core';
import { ApiRoutesModule } from './routes/api-routes.module';

@Module({
  imports: [
    ApiRoutesModule,
    NestRouter.register([
      {
        path: 'api',
        module: ApiRoutesModule,
      },
    ]),
  ],
})
export class AppRouterModule {}
