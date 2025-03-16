import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/shared/helpers/api-response';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const httpContext = context.switchToHttp();
        const { statusCode } = httpContext.getResponse();

        if (data instanceof ApiResponse) {
          return data;
        }

        const { message, ...rests } = data;

        return new ApiResponse({
          statusCode: statusCode,
          message: message ? message : 'Successfully',
          data: rests,
        });
      }),
    );
  }
}
