import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Request, Response } from 'express';
import { Socket } from 'socket.io';
import { SocketEvents } from 'src/socket/constants/socket.constants';

@Catch()
export class ErrorService
  extends BaseWsExceptionFilter
  implements ExceptionFilter
{
  catch(exception: any, host: ArgumentsHost) {
    const httpCtx = host.switchToHttp();

    const httpResponse = httpCtx.getResponse<Response>();
    const httpRequest = httpCtx.getRequest<Request>();

    try {
      if (exception instanceof HttpException) {
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        let errorMessage: string | undefined = undefined;

        if (typeof exceptionResponse === 'object') {
          errorMessage = exception.message;
        }

        if (typeof exceptionResponse === 'string') {
          errorMessage = exceptionResponse;
        }

        httpResponse.status(status).json({
          message: errorMessage || 'Request Failed',
          status,
          success: status < 400,
          date: Date.now(),
          path: httpRequest.url,
        });

        return;
      }

      if (exception instanceof WsException) {
        const ctx = host.switchToWs();
        const client = ctx.getClient<Socket>();

        const errorMessage = exception.message;

        client.emit(SocketEvents.Error, errorMessage);

        return;
      }

      throw exception;
    } catch (error) {
      console.log(error);
      const message = exception?.message || 'Internal Server Error';
      const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

      httpResponse.status(statusCode).json({
        message,
        status: statusCode,
        success: false,
        date: Date.now(),
        path: httpRequest.url,
      });

      return;
    }
  }
}
