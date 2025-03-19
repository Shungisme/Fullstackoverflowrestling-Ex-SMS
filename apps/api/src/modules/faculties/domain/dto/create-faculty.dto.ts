import { createZodDto } from 'nestjs-zod';
import { facultiesSchema } from './faculties.dto';

export class CreateFacultyDTO extends createZodDto(
  facultiesSchema.omit({ id: true }),
) {}
