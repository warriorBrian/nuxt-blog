import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import {Request, Response} from 'express';
import {Logger} from 'src/log';
const logger = Logger('console');
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    logger.error(`错误状态:${status}, message: ${exception.message}, path: ${request.url}`);
    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().getTime(),
      path: request.url
    });
  }
}
