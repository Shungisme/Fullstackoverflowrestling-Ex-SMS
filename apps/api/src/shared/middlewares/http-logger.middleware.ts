import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';

    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const responseTime = Date.now() - startTime;

      const logData = {
        method,
        url: originalUrl,
        statusCode,
        contentLength,
        responseTime: `${responseTime}ms`,
        ip,
        userAgent,
      };

      // Get request body for non-GET requests
      const requestBody = method !== 'GET' ? req.body : undefined;
      if (requestBody) {
        // Avoid logging sensitive data (like passwords)
        const sanitizedBody = this.sanitizeRequestBody(requestBody);
        Object.assign(logData, { requestBody: sanitizedBody });
      }

      // Choose log level based on status code
      if (statusCode >= 500) {
        this.logger.error(
          `HTTP Server Error - ${method} ${originalUrl} ${statusCode} (${responseTime}ms)`,
          {
            context: 'HttpLogger',
            ...logData,
          },
        );
      } else if (statusCode >= 400) {
        this.logger.warn(
          `HTTP Client Error - ${method} ${originalUrl} ${statusCode} (${responseTime}ms)`,
          {
            context: 'HttpLogger',
            ...logData,
          },
        );
      } else {
        // Normal requests - log as info
        this.logger.info(
          `HTTP Request - ${method} ${originalUrl} ${statusCode} (${responseTime}ms)`,
          {
            context: 'HttpLogger',
            ...logData,
          },
        );
      }
    });

    next();
  }

  private sanitizeRequestBody(body: any): any {
    if (!body) return body;

    // Create a copy to avoid modifying the original request
    const sanitized = { ...body };

    // Remove sensitive fields
    const sensitiveFields = [
      'password',
      'passwordConfirmation',
      'token',
      'secret',
      'apiKey',
    ];
    sensitiveFields.forEach((field) => {
      if (field in sanitized) {
        sanitized[field] = '********';
      }
    });

    return sanitized;
  }
}
