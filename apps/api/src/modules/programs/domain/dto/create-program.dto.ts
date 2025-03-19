import { createZodDto } from 'nestjs-zod';
import { programsSchema } from './programs.dto';

export class CreateProgramDTO extends createZodDto(
  programsSchema.omit({ id: true }),
) {}
