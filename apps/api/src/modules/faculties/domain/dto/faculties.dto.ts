import { createZodDto } from 'nestjs-zod';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { z } from 'zod';

export const facultiesSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title cannot be empty'),
  description: z.string().min(1, 'Description cannot be empty'),
  status: z.enum(['active', 'inactive'], {
    message: 'Invalid status',
  }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export class FacultiesDto extends createZodDto(facultiesSchema) {}

export class FacultyResponseWrapperDTO {
  data: FacultiesDto;
  message: string;
  statusCode: number;
}

export class FacultiesResponseWrapperDTO {
  data: PaginatedResponse<FacultiesDto>;
  message: string;
  statusCode: number;
}
