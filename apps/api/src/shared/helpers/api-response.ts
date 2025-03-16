import { z } from 'zod';

export type ApiResponseType<T> = {
  statusCode: number;
  message: string;
  data?: T;
};

export class ApiResponse<T> {
  statusCode: number;
  message: string;
  data?: T;

  constructor(data: ApiResponseType<T>) {
    Object.assign(this, data);
  }
}

const ApiResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
});

export const createResponseWrapperSchema = <T extends z.ZodType>(
  dataSchema: T,
) => {
  return ApiResponseSchema.extend({
    data: dataSchema.optional(),
  });
};
