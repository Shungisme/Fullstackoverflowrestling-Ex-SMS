import { createZodDto } from 'nestjs-zod';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { z } from 'zod';

export const studentClassEnrollSchema = z.object({
  id: z.string().optional(),
  studentId: z.string().min(1, 'Student ID is required'),
  classCode: z.string().min(1, 'Class code is required'),
  type: z.enum(['COMPLETE', 'DROP', 'FAIL'], {
    message: 'Invalid enrollment type',
  }),
  createdAt: z.date().optional(),
});

export class StudentClassEnrollDto extends createZodDto(
  studentClassEnrollSchema,
) {}

export class StudentClassEnrollResponseWrapperDTO {
  data: StudentClassEnrollDto;
  message: string;
  statusCode: number;
}

export class StudentClassEnrollsResponseWrapperDTO {
  data: PaginatedResponse<StudentClassEnrollDto>;
  message: string;
  statusCode: number;
}
