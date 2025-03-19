import { createZodDto } from 'nestjs-zod';
import { statusesSchema } from './statuses.dto';

export class CreateStatusDTO extends createZodDto(
  statusesSchema.omit({ id: true }),
) {}
