import { Module } from '@nestjs/common';
import { ErrorService } from './error.service';
import { APP_FILTER } from '@nestjs/core';
// import { MyLogger } from '../logger.service';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorService,
    },
  ],
})
export class ErrorFilterModule {}
