import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as path from 'path';

// Define HTTP method types for better type safety
type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS'
  | 'HEAD';

// Method color configuration
const methodColors: Record<HttpMethod, string> = {
  GET: '\x1b[32m', // Green
  POST: '\x1b[34m', // Blue
  PUT: '\x1b[33m', // Yellow
  PATCH: '\x1b[33m', // Yellow
  DELETE: '\x1b[31m', // Red
  OPTIONS: '\x1b[36m', // Cyan
  HEAD: '\x1b[36m', // Cyan
};

const RESET_COLOR = '\x1b[0m'; // Reset to default color

const structuredJsonFormat = winston.format((info) => {
  // Standardize log structure
  const standardizedInfo: {
    timestamp: string;
    level: string;
    context: string;
    message: string;
    http?: object;
    requestData?: any;
    meta?: Record<string, any>;
  } = {
    // Base log data
    timestamp: new Date().toISOString(),
    level: info.level as string,
    context: (info.context as string) || 'App',
    message: String(info.message),

    // HTTP specific data
    http: info.method
      ? {
          method: info.method,
          url: info.url,
          statusCode: info.statusCode,
          responseTime: info.responseTime,
          contentLength: info.contentLength,
          ip: info.ip,
          userAgent: info.userAgent,
        }
      : undefined,

    // Request body (if available)
    requestData: info.requestBody,

    // Other metadata - make it optional with ?
    meta: { ...info },
  };

  // Remove duplicated fields from meta
  const fieldsToRemove = [
    'timestamp',
    'level',
    'context',
    'message',
    'method',
    'url',
    'statusCode',
    'responseTime',
    'contentLength',
    'ip',
    'userAgent',
    'requestBody',
    'http',
    'requestData',
  ];

  fieldsToRemove.forEach((field) => delete standardizedInfo.meta?.[field]);

  // Clean up empty objects - set to undefined instead of using delete
  if (
    standardizedInfo.meta &&
    Object.keys(standardizedInfo.meta).length === 0
  ) {
    standardizedInfo.meta = undefined;
  }

  if (!standardizedInfo.http) {
    standardizedInfo.http = undefined;
  }

  if (!standardizedInfo.requestData) {
    standardizedInfo.requestData = undefined;
  }

  return standardizedInfo;
});

@Module({
  imports: [
    WinstonModule.forRoot({
      levels: winston.config.npm.levels,
      transports: [
        // Console transport for development with more detailed output and colored methods
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf((info) => {
              // Extract basic properties for the primary log line
              const { level, message, timestamp, context } = info;

              // Start with the basic log line
              let log = `${timestamp} [${context || 'App'}] ${level}: ${message}`;

              // Add HTTP details if present (for HTTP logger) with colored method
              if (info.method && info.url) {
                // Apply method-specific color with type safety
                const method = info.method as string;
                const methodColor = Object.prototype.hasOwnProperty.call(
                  methodColors,
                  method,
                )
                  ? methodColors[method as HttpMethod]
                  : '\x1b[0m';

                const coloredMethod = `${methodColor}${method}${RESET_COLOR}`;

                const details = [
                  `Method: ${coloredMethod}`,
                  `URL: ${info.url}`,
                  `Status: ${getStatusWithColor(Number(info.statusCode))}`,
                  `Time: ${info.responseTime}`,
                ].join(' | ');

                log += `\n  → ${details}`;

                // Add request body if present
                if (info.requestBody) {
                  log += `\n  → Request: ${JSON.stringify(info.requestBody)}`;
                }
              }

              // Add stack trace if present
              if (info.trace) {
                log += `\n${info.trace}`;
              }

              return log;
            }),
          ),
        }),

        // Daily rotate file for HTTP requests (all levels) with improved structure
        new DailyRotateFile({
          dirname: path.join(process.cwd(), 'logs', 'http'),
          filename: 'http-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(
            structuredJsonFormat(),
            winston.format.json(),
          ),
        }),

        // Daily rotate file for errors with improved structure
        new DailyRotateFile({
          level: 'error',
          dirname: path.join(process.cwd(), 'logs', 'errors'),
          filename: 'error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '30d',
          format: winston.format.combine(
            structuredJsonFormat(),
            winston.format.json(),
          ),
        }),
      ],
    }),
  ],
  exports: [WinstonModule],
})
export class LoggerModule {}

// Helper function to colorize status codes
function getStatusWithColor(status: number): string {
  if (!status) return 'unknown';

  if (status < 300) {
    // Success (2xx) - Green
    return `\x1b[32m${status}\x1b[0m`;
  } else if (status < 400) {
    // Redirect (3xx) - Cyan
    return `\x1b[36m${status}\x1b[0m`;
  } else if (status < 500) {
    // Client Error (4xx) - Yellow
    return `\x1b[33m${status}\x1b[0m`;
  } else {
    // Server Error (5xx) - Red
    return `\x1b[31m${status}\x1b[0m`;
  }
}
