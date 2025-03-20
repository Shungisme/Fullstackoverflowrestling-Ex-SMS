import { createZodDto } from 'nestjs-zod';
import { STUDENT_CONSTANT } from 'src/shared/constants/student.constant';
import { z } from 'zod';
import { Gender } from '@prisma/client'; // <- important
import { ObjectId } from 'mongodb';
import { createResponseWrapperSchema } from 'src/shared/helpers/api-response';
import { identity } from 'rxjs';
const StudentSchema = z.object({
  id: z
    .string()
    .refine((id) => ObjectId.isValid(id), { message: 'Invalid ObjectId' })
    .optional(),
  studentId: z.string().min(1, 'studentId cannot be empty'),
  name: z.string().min(1, 'Name cannot be empty'),
  dateOfBirth: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date of birth format',
    })
    .transform((date) => new Date(date)),
  gender: z.nativeEnum(Gender),
  course: z.number().int().min(1, 'Course must be a positive integer'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10).max(15),
  nationality: z.string().min(1, 'Nationality cannot be empty'),
  facultyId: z.string().min(1, 'Faculty cannot be empty'),
  permanentAddressId: z.string().optional().nullable(),
  temporaryAddressId: z.string().optional().nullable(),
  mailingAddressId: z.string().min(1, 'Mailing address cannot be empty'),
  identityPaperId: z.string().min(1, 'Identity paper cannot be empty'),
  programId: z.string().min(1, 'Program cannot be empty'),
  statusId: z.string().min(1, 'Status cannot be empty'),
});

const StudentsResponseSchema = z.object({
  students: z.array(StudentSchema),
  total: z.number(),
});

export class StudentRequestDTO extends createZodDto(
  StudentSchema.omit({ id: true }),
) {}
export class StudentResponseDTO extends createZodDto(StudentSchema) {}
export class StudentsResponseDTO extends createZodDto(StudentsResponseSchema) {}
export class UpdateStudentRequestDTO extends createZodDto(
  StudentSchema.omit({ studentId: true }),
) {}

export type StudentReponseType = z.infer<typeof StudentSchema>;
export type StudentRequestType = z.infer<typeof StudentSchema>;

const StudentApiResponse = createResponseWrapperSchema(StudentSchema);
const StudentsResponseWrapperSchema = createResponseWrapperSchema(
  StudentsResponseSchema,
);

export class StudentResponseWrapperDTO extends createZodDto(
  StudentApiResponse,
) {}

export class StudentsResponseWrapperDTO extends createZodDto(
  StudentsResponseWrapperSchema,
) {}

export class StudentDTO extends createZodDto(StudentSchema) {}
export class CreateStudentDTO extends createZodDto(
  StudentSchema.omit({ id: true }),
) {}
export class UpdateStudentDTO extends createZodDto(
  StudentSchema.omit({ id: true }).partial(),
) {}
