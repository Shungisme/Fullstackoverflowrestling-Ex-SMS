import { createZodDto } from 'nestjs-zod';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { z } from 'zod';

export const subjectPrerequisiteSchema = z.object({
  id: z.string().optional(),
  subjectId: z.string().min(1, 'Subject ID cannot be empty'),
  prerequisiteSubjectId: z
    .string()
    .min(1, 'Prerequisite subject ID cannot be empty'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export class SubjectPrerequisiteDto extends createZodDto(
  subjectPrerequisiteSchema,
) {}

export class SubjectPrerequisiteResponseDto {
  id: string;
  subjectId: string;
  prerequisiteSubjectId: string;
  subject?: {
    id: string;
    code: string;
    title: string;
  };
  prerequisiteSubject?: {
    id: string;
    code: string;
    title: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export class SubjectPrerequisiteResponseWrapperDTO {
  data: SubjectPrerequisiteResponseDto;
  message: string;
  statusCode: number;
}

export class SubjectPrerequisitesResponseWrapperDTO {
  data: PaginatedResponse<SubjectPrerequisiteResponseDto>;
  message: string;
  statusCode: number;
}
