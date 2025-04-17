import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const exportTranscriptSchema = z.object({
  studentId: z.string().min(1, 'Student ID cannot be empty'),
});

export class exportTranscriptDTO extends createZodDto(exportTranscriptSchema) {}
