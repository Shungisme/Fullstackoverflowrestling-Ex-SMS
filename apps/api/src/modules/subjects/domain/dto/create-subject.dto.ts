import { createZodDto } from 'nestjs-zod';
import { subjectsSchema } from './subjects.dto';

export class CreateSubjectDTO extends createZodDto(
  subjectsSchema.omit({ id: true, createdAt: true, updatedAt: true }),
) {}
