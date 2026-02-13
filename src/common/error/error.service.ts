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
import { QueryFailedError } from 'typeorm';

@Catch(HttpException)
export class HTTPErrorService implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const httpCtx = host.switchToHttp();

    const httpResponse = httpCtx.getResponse<Response>();
    const httpRequest = httpCtx.getRequest<Request>();

    try {
      let errorMessage: string | undefined = undefined;
      let status: number | undefined = HttpStatus.INTERNAL_SERVER_ERROR;

      if (exception instanceof HttpException) {
        status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        if (typeof exceptionResponse === 'object') {
          errorMessage = exception.message;
        }

        if (typeof exceptionResponse === 'string') {
          errorMessage = exceptionResponse;
        }
      }

      if (exception instanceof QueryFailedError) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = 'Request Failed';
      }

      httpResponse.status(status).json({
        message: errorMessage || 'Request Failed',
        status,
        success: false,
        date: Date.now(),
        path: httpRequest.url,
      });

      console.log(`timestamp: ${Date.now()}`, exception);
      return;
    } catch (error) {
      console.log(`timestamp: ${Date.now()}`, error);
      const message = exception?.message || 'Internal Server Error';
      const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

      httpResponse.status(statusCode).json({
        message,
        status: statusCode,
        success: false,
        date: Date.now(),
        path: httpRequest.url,
      });
    }

    return;
  }
}

@Catch(WsException)
export class WsErrorService extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToWs();
    const client = ctx.getClient<Socket>();

    let errorMessage: string | undefined = 'Request Failed';

    try {
      if (exception instanceof WsException) {
        errorMessage = exception.message ?? 'Request Failed';
      }

      console.log(`timestamp: ${Date.now()}`, exception);
    } catch (error) {
      console.log(`timestamp: ${Date.now()}`, error);
      errorMessage = error?.message || 'Request Execution Failed';
    }

    client.emit(SocketEvents.Error, errorMessage);

    return;
  }
}
