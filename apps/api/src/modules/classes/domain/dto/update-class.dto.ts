import { createZodDto } from 'nestjs-zod';
import { classesSchema } from './classes.dto';

export class UpdateClassDTO extends createZodDto(
  classesSchema
    .omit({ id: true, code: true, createdAt: true, updatedAt: true })
    .partial(),
) {}
