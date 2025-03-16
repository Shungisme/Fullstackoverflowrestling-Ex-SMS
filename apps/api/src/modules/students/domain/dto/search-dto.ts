import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const SearchRequestSchema = z.object({
  key: z.string().default(''),
  limit: z.number().default(5),
  page: z.number().default(1),
});

export class SearchRequestDTO extends createZodDto(SearchRequestSchema) {}
export type SearchType = z.infer<typeof SearchRequestSchema>;
