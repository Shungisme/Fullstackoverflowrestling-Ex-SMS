import { createZodDto } from 'nestjs-zod';
import { studentClassEnrollSchema } from './student-class-enroll.dto';

export class UpdateStudentClassEnrollDTO extends createZodDto(
  studentClassEnrollSchema.omit({ id: true, createdAt: true }).partial(),
) {}
