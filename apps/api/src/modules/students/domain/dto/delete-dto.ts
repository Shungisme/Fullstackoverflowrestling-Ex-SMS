import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const DeleteStudentSchema = z
  .object({
    isDeleted: z.boolean().default(false),
    message: z.string().optional().nullable(),
  })
  .strict();

export class DeleteStudentResponseDTO extends createZodDto(
  DeleteStudentSchema,
) {}
