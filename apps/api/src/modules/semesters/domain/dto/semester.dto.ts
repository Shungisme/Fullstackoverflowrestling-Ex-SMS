import { createZodDto } from 'nestjs-zod';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { z } from 'zod';

export const semesterSchema = z.object({
  id: z.string().optional(),
  academicYear: z.string().min(1, 'Academic Year cannot be empty'),
  semester: z.number().int().min(1, 'Semester must be greater than 0'),
  startedAt: z.date(),
  endedAt: z.date(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export class SemesterDto extends createZodDto(semesterSchema) {}

export class SemesterResponseWrapperDTO {
  data: SemesterDto;
  message: string;
  statusCode: number;
}

export class SemestersResponseWrapperDTO {
  data: PaginatedResponse<SemesterDto>;
  message: string;
  statusCode: number;
}
