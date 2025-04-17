import { createZodDto } from 'nestjs-zod';
import { subjectPrerequisiteSchema } from './subject-prerequisite.dto';

export class CreateSubjectPrerequisiteDTO extends createZodDto(
  subjectPrerequisiteSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
) {}
