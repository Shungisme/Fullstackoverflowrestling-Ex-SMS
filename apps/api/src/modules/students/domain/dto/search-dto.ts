import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const SearchRequestSchema = z.object({
  key: z.string().default(''),
  limit: z
    .string()
    .default('1000')
    .transform((val) => parseInt(val, 10)),
  page: z
    .string()
    .default('1')
    .transform((val) => parseInt(val, 10)),
});

export class SearchRequestDTO extends createZodDto(SearchRequestSchema) {}
export type SearchType = z.infer<typeof SearchRequestSchema>;
