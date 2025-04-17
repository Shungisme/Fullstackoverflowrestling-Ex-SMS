import { createZodDto } from 'nestjs-zod';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { z } from 'zod';

export const studentClassResultSchema = z.object({
  id: z.string().optional(),
  studentId: z.string().min(1, 'Student ID is required'),
  classCode: z.string().min(1, 'Class code is required'),
  type: z.enum(['MIDTERM', 'FINALTERM', 'OTHER'], {
    message: 'Invalid result type',
  }),
  factor: z.number().min(0, 'Factor must be greater than or equal to 0'),
  score: z
    .number()
    .min(0, 'Score must be greater than or equal to 0')
    .max(10, 'Score must be less than or equal to 10'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export class StudentClassResultDto extends createZodDto(
  studentClassResultSchema,
) {}

export class StudentClassResultResponseWrapperDTO {
  data: StudentClassResultDto;
  message: string;
  statusCode: number;
}

export class StudentClassResultsResponseWrapperDTO {
  data: PaginatedResponse<StudentClassResultDto>;
  message: string;
  statusCode: number;
}
