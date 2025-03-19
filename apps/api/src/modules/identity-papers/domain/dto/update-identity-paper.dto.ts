import { createZodDto } from 'nestjs-zod';
import { identityPapersSchema } from './identity-papers.dto';

export class UpdateIdentityPaperDTO extends createZodDto(
  identityPapersSchema.omit({ id: true, createdAt: true }),
) {}
