import { createZodDto } from 'nestjs-zod';
import { identityPapersSchema } from './identity-papers.dto';

export class CreateIdentityPaperDTO extends createZodDto(
  identityPapersSchema.omit({ id: true }),
) {}
