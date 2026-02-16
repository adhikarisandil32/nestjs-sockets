import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';
import { APP_MODE } from '../configs/service-configs/app.config';

@Injectable()
export class MemoryLoggerMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (this.configService.get<string>('app.mode') === APP_MODE.DEV) {
      const startUsage = process.memoryUsage();

      const startUsageInMb = {
        datetime: Date.now(),
        rss: `${(startUsage.rss / (1024 * 1024)).toFixed(2)} MB`,
        heapTotal: `${(startUsage.heapTotal / (1024 * 1024)).toFixed(2)} MB`,
        heapUsed: `${(startUsage.heapUsed / (1024 * 1024)).toFixed(2)} MB`,
        external: `${(startUsage.external / (1024 * 1024)).toFixed(2)} MB`,
        arrayBuffers: `${(startUsage.arrayBuffers / (1024 * 1024)).toFixed(2)} MB`,
      };

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

        const filePath = './request_memory_usage_logs.log';

        if (!fs.existsSync(filePath)) {
          fs.writeFile(
            filePath,
            JSON.stringify({
              path: req.path,
              beforeResponse: startUsageInMb,
              afterResponse: endUsageInMb,
            }),
            () => null,
          );

          return;
        }

        fs.appendFile(
          filePath,
          JSON.stringify({
            path: req.path,
            beforeResponse: startUsageInMb,
            afterResponse: endUsageInMb,
          }) + '\n',
          () => null,
        );
      });
    }

    next();
  }
}
