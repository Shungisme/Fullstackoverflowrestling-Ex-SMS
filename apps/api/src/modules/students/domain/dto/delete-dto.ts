import { createZodDto } from 'nestjs-zod';
import { createResponseWrapperSchema } from 'src/shared/helpers/api-response';
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

const createDeleteStudentSchema =
  createResponseWrapperSchema(DeleteStudentSchema);

export class DeleteStudentWrapperResponseDTO extends createZodDto(
  createDeleteStudentSchema,
) {}
