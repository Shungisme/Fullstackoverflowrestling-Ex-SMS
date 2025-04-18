import { createZodDto } from 'nestjs-zod';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { z } from 'zod';
import { StatusEnum } from '@prisma/client';

export const subjectsSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, 'Code cannot be empty'),
  title: z.string().min(1, 'Title cannot be empty'),
  credit: z.number().int().min(2, 'Credit must be at least 2'),
  facultyId: z.string().min(1, 'Faculty ID cannot be empty'),
  description: z.string().min(1, 'Description cannot be empty'),
  status: z.nativeEnum(StatusEnum, {
    message: 'Invalid status',
  }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export class SubjectsDto extends createZodDto(subjectsSchema) {}

export class SubjectResponseWrapperDTO {
  data: SubjectsDto;
  message: string;
  statusCode: number;
}

export class SubjectsResponseWrapperDTO {
  data: PaginatedResponse<SubjectsDto>;
  message: string;
  statusCode: number;
}
