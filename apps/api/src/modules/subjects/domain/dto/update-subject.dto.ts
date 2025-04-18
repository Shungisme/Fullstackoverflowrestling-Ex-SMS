import { createZodDto } from 'nestjs-zod';
import { subjectsSchema } from './subjects.dto';

export class UpdateSubjectDTO extends createZodDto(
  subjectsSchema
    .omit({ id: true, code: true, createdAt: true, updatedAt: true })
    .partial(),
) {}
