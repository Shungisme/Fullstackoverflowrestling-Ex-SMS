import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { createResponseWrapperSchema } from 'src/shared/helpers/api-response';

export const AddressSchema = z.object({
  id: z.string(),
  number: z.string(),
  street: z.string(),
  district: z.string(),
  city: z.string(),
  country: z.string(),
});

export const ProgramSchema = z.object({
  id: z.string(),
  title: z.string(),
});

export const StatusSchema = z.object({
  id: z.string(),
  title: z.string(),
});

export const IdentityPaperSchema = z.object({
  id: z.string(),
  type: z.string(),
  number: z.string(),
  issueDate: z.date(),
  expirationDate: z.date(),
  placeOfIssue: z.string(),
  hasChip: z.boolean().nullable().optional(),
  issuingCountry: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const FacultySchema = z.object({
  id: z.string(),
  title: z.string(),
});

export const StudentSchema = z.object({
  studentId: z.string(),
  name: z.string(),
  dateOfBirth: z.date(),
  gender: z.string(),
  course: z.number(),
  email: z.string().email(),
  phone: z.string(),
  nationality: z.string(),
  faculty: FacultySchema,
  permanentAddress: AddressSchema.nullable().optional(),
  temporaryAddress: AddressSchema.nullable().optional(),
  mailingAddress: AddressSchema,
  program: ProgramSchema,
  status: StatusSchema,
  identityPaper: IdentityPaperSchema,
});

export const StudentsResponseSchema = z.object({
  students: z.array(StudentSchema),
  total: z.number(),
});

export type StudentsResponse = z.infer<typeof StudentsResponseSchema>;
export type StudentResponse = z.infer<typeof StudentSchema>;

export class StudentResponseDTO extends createZodDto(StudentSchema) {}
export class StudentsResponseDTO extends createZodDto(StudentsResponseSchema) {}

const StudentsResponseSchemaWrapper = createResponseWrapperSchema(
  StudentsResponseSchema,
);

export class StudentsResponseWrapperDTO extends createZodDto(
  StudentsResponseSchemaWrapper,
) {}

const StudentResponseSchemaWrapper = createResponseWrapperSchema(
  StudentsResponseSchema,
);

export class StudentResponseWrapperDTO extends createZodDto(
  StudentResponseSchemaWrapper,
) {}
