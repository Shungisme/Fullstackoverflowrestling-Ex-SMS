import { createZodDto } from 'nestjs-zod';
import { programsSchema } from './programs.dto';

export class UpdateProgramDTO extends createZodDto(
  programsSchema.omit({ id: true, createdAt: true }).partial(),
) {}
