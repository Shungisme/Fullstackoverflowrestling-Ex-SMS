import { createZodDto } from 'nestjs-zod';
import { statusesSchema } from './statuses.dto';

export class UpdateStatusDTO extends createZodDto(
  statusesSchema.omit({ id: true, createdAt: true }),
) {}
