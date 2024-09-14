import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';
import { Logger } from 'winston';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const now = Date.now();

    // Log Request (method, url, headers, body)
    console.info('\nRequest: ', {
      method: request.method,
      url: request.url,
      headers: request.headers,
      body: request.body,
    });

    return next.handle().pipe(
      tap(() => {
        // Log Response (status, headers, body)
        console.info('\nResponse: ', {
          method: request.method,
          url: request.url,
          status: response.statusCode,
          headers: response.getHeaders(),
          body: response.body,
        });
      }),
    );
  }
}
