import { createZodDto } from 'nestjs-zod';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';

import { z } from 'zod';

export const statusesSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title cannot be empty'),
  description: z.string().min(1, 'Description cannot be empty'),
  status: z.enum(['active', 'inactive'], {
    message: 'Invalid status',
  }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export class StatusesDto extends createZodDto(statusesSchema) {}

export class StatusResponseWrapperDTO {
  data: StatusesDto;
  message: string;
  statusCode: number;
}

export class StatusesResponseWrapperDTO {
  data: PaginatedResponse<StatusesDto>;
  message: string;
  statusCode: number;
}
