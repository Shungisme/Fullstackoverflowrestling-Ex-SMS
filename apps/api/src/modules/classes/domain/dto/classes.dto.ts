import { createZodDto } from 'nestjs-zod';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { z } from 'zod';

export const classesSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, 'Code cannot be empty'),
  subjectCode: z.string().min(1, 'Subject code cannot be empty'),
  semesterId: z.string().min(1, 'Semester ID cannot be empty'),
  teacherName: z.string().min(1, 'Teacher name cannot be empty'),
  maximumQuantity: z
    .number()
    .int()
    .positive('Maximum quantity must be a positive integer'),
  classSchedule: z.string().min(1, 'Class schedule cannot be empty'),
  classroom: z.string().min(1, 'Classroom cannot be empty'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export class ClassesDto extends createZodDto(classesSchema) {}

export class ClassResponseDto {
  id: string;
  code: string;
  subjectCode: string;
  semesterId: string;
  teacherName: string;
  maximumQuantity: number;
  classSchedule: string;
  classroom: string;
  createdAt?: Date;
  updatedAt?: Date;

  // Optional expanded relationships
  subject?: {
    id: string;
    code: string;
    title: string;
    credit: number;
  };
  semester?: {
    id: string;
    academicYear: string;
    semester: number;
    startedAt: Date;
    endedAt: Date;
  };
  currentEnrollments?: number;
}

export class ClassResponseWrapperDTO {
  data: ClassResponseDto;
  message: string;
  statusCode: number;
}

export class ClassesResponseWrapperDTO {
  data: PaginatedResponse<ClassResponseDto>;
  message: string;
  statusCode: number;
}
