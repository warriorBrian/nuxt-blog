import {Injectable, NestInterceptor, ExecutionContext, CallHandler} from '@nestjs/common';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Response, Request} from 'express';
import {defaultTo} from 'src/core/lib'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const computedCode = Number((response.statusCode / 200).toFixed()) > 1 ? response.statusCode : 200;
    response.status(computedCode);
    /**
     * 这里必须要先设置response.status，不能直接设置response.status(code).json
     * 否则会报错提示 Cannot set headers after they are sent to the client
     * 响应两次response导致报错
     * */
    return next.handle().pipe(
      map(data => {
        const receiveData = defaultTo(data, []);
        const {message, ...responseData} = receiveData;
        return {
          code: response.statusCode,
          data: Array.isArray(receiveData) ? receiveData : responseData,
          message: defaultTo(message, '')
        };
      })
    );
  }
}
