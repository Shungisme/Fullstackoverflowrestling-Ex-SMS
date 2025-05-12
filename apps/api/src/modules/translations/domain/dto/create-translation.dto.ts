import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Define the schema
const createTranslationSchema = z.object({
  entity: z.string({
    required_error: 'Entity type is required',
    description: 'Entity type (e.g., Faculty, Program)',
  }),
  entityId: z.string({
    required_error: 'Entity ID is required',
    description: 'ID of the entity to translate',
  }),
  fields: z.record(z.string(), z.string(), {
    required_error: 'Fields to translate are required',
    description: 'Fields to translate',
  }),
});

// Create the DTO class
export class CreateTranslationDTO extends createZodDto(
  createTranslationSchema,
) {}

// Export the type
export type CreateTranslationType = z.infer<typeof createTranslationSchema>;
