import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request as IRequest, Response as IResponse } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: Record<string, any>) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<IResponse>();
        // const request = ctx.getRequest<IRequest>();

        const responseMessage =
          this.reflector.get<string>('responseMessage', context.getHandler()) ??
          'Request success';

        return {
          statusCode: response.statusCode,
          message: responseMessage,
          success: response.statusCode < 400,
          data,
        };
      }),
    );
  }
}
