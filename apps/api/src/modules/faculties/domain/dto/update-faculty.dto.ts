import { createZodDto } from 'nestjs-zod';
import { facultiesSchema } from './faculties.dto';

export class UpdateFacultyDTO extends createZodDto(
  facultiesSchema.omit({ id: true, createdAt: true }).partial(),
) {}
