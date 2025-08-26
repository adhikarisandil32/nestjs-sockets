import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';

@Injectable()
export class MemoryLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startUsage = process.memoryUsage();

    const startUsageInMb = {
      datetime: Date.now(),
      rss: `${(startUsage.rss / (1024 * 1024)).toFixed(2)} MB`,
      heapTotal: `${(startUsage.heapTotal / (1024 * 1024)).toFixed(2)} MB`,
      heapUsed: `${(startUsage.heapUsed / (1024 * 1024)).toFixed(2)} MB`,
      external: `${(startUsage.external / (1024 * 1024)).toFixed(2)} MB`,
      arrayBuffers: `${(startUsage.arrayBuffers / (1024 * 1024)).toFixed(2)} MB`,
    };

    fs.appendFile(
      './request_memory_usage_logs.txt',
      ',' + JSON.stringify(startUsageInMb),
      () => null,
    );

    res.on('finish', () => {
      const endUsage = process.memoryUsage();

      const endUsageInMb = {
        datetime: Date.now(),
        rss: `${(endUsage.rss / (1024 * 1024)).toFixed(2)} MB`,
        heapTotal: `${(endUsage.heapTotal / (1024 * 1024)).toFixed(2)} MB`,
        heapUsed: `${(endUsage.heapUsed / (1024 * 1024)).toFixed(2)} MB`,
        external: `${(endUsage.external / (1024 * 1024)).toFixed(2)} MB`,
        arrayBuffers: `${(endUsage.arrayBuffers / (1024 * 1024)).toFixed(2)} MB`,
      };

      fs.appendFile(
        './request_memory_usage_logs.txt',
        ',' + JSON.stringify(endUsageInMb),
        () => null,
      );
    });

    next();
  }
}
