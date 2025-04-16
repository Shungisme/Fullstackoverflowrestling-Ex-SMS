import { createZodDto } from 'nestjs-zod';
import { classesSchema } from './classes.dto';

export class CreateClassDTO extends createZodDto(
  classesSchema.omit({ id: true, createdAt: true, updatedAt: true }),
) {}
