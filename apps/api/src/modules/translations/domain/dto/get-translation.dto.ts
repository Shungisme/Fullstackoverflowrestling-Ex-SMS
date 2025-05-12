import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const getTranslationSchema = z.object({
  entity: z.string({
    required_error: 'Entity type is required',
    description: 'Entity type (e.g., Faculty, Program)',
  }),
  entityId: z.string({
    required_error: 'Entity ID is required',
    description: 'ID of the entity',
  }),
  field: z.string({
    required_error: 'Field name is required',
    description: 'Field name to get translation for',
  }),
  lang: z.string({
    required_error: 'Language code is required',
    description: 'Target language code',
  }),
});

export class GetTranslationDTO extends createZodDto(getTranslationSchema) {}

export type GetTranslationType = z.infer<typeof getTranslationSchema>;
