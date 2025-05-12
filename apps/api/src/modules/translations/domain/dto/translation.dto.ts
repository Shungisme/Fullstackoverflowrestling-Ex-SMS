import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const translationSchema = z.object({
  id: z.string(),
  entity: z.string(),
  entityId: z.string(),
  field: z.string(),
  lang: z.string(),
  value: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export class TranslationDto extends createZodDto(translationSchema) {}

export type TranslationType = z.infer<typeof translationSchema>;
