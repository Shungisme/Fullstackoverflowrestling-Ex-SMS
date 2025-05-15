import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const SearchRequestSchema = z.object({
  key: z.string().default(''),
  limit: z
    .string()
    .default('5')
    .transform((val, ctx) => {
      const parsed = Number(val);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid number',
        });
        return z.NEVER;
      }
      return parsed;
    }),
  page: z
    .string()
    .default('1')
    .transform((val, ctx) => {
      const parsed = Number(val);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid number',
        });
        return z.NEVER;
      }
      return parsed;
    }),
  faculty: z.string().default(''),
  lang: z.string().optional(),
});

export class SearchRequestDTO extends createZodDto(SearchRequestSchema) {}
export type SearchType = z.infer<typeof SearchRequestSchema>;
