import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { errorHandler } from 'src/common/helpers';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus ? exception.getStatus() : 500;

    const error = errorHandler(exception);

    if (error) {
      response.status(400).json({
        statusCode: 400,
        timestamp: new Date().toISOString(),
        message: error,
      });
    } else if (status === 500) {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message,
      });
    } else {
      response.status(status).json(exception.getResponse());
    }
  }
}
