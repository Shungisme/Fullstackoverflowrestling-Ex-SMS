import { createZodDto } from 'nestjs-zod';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { z } from 'zod';

export const programsSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title cannot be empty'),
  description: z.string().min(1, 'Description cannot be empty'),
  status: z.enum(['active', 'inactive'], {
    message: 'Invalid status',
  }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export class ProgramsDto extends createZodDto(programsSchema) {}

export class ProgramResponseWrapperDTO {
  data: ProgramsDto;
  message: string;
  statusCode: number;
}

export class ProgramsResponseWrapperDTO {
  data: PaginatedResponse<ProgramsDto>;
  message: string;
  statusCode: number;
}
