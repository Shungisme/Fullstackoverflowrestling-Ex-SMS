import { createZodDto } from 'nestjs-zod';
import { studentClassEnrollSchema } from './student-class-enroll.dto';

export class CreateStudentClassEnrollDTO extends createZodDto(
  studentClassEnrollSchema.omit({ id: true, createdAt: true }),
) {}
