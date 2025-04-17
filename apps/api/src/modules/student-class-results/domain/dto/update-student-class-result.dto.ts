import { createZodDto } from 'nestjs-zod';
import { studentClassResultSchema } from './student-class-result.dto';

export class UpdateStudentClassResultDTO extends createZodDto(
  studentClassResultSchema
    .omit({ id: true, createdAt: true, updatedAt: true })
    .partial(),
) {}
