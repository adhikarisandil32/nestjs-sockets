import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HTTPErrorService } from './error.service';
// import { MyLogger } from '../logger.service';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HTTPErrorService,
    },
  ],
})
export class ErrorFilterModule {}
