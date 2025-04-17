import { createZodDto } from 'nestjs-zod';
import { semesterSchema } from './semester.dto';

export class CreateSemesterDTO extends createZodDto(
  semesterSchema.omit({ id: true, createdAt: true, updatedAt: true }),
) {}
