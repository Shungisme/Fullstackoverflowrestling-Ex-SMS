import { createZodDto } from 'nestjs-zod';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { z } from 'zod';

export const identityPapersSchema = z.object({
  id: z.string().optional(),
  type: z.string().min(1, 'Type cannot be empty'),
  number: z.string().min(1, 'Number cannot be empty'),
  issueDate: z.coerce.date(),
  expirationDate: z.coerce.date(),
  placeOfIssue: z.string().min(1, 'Place of issue cannot be empty'),
  hasChip: z.boolean().optional().nullable(),
  issuingCountry: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export class IdentityPapersDto extends createZodDto(identityPapersSchema) {}

export class IdentityPaperResponseWrapperDTO {
  data: IdentityPapersDto;
  message: string;
  statusCode: number;
}

export class IdentityPapersResponseWrapperDTO {
  data: PaginatedResponse<IdentityPapersDto>;
  message: string;
  statusCode: number;
}

export class CreateIdentityPaperDTO extends createZodDto(
  identityPapersSchema.omit({ id: true }),
) {}
