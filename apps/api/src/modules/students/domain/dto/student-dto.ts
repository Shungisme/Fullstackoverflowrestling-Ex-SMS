import { createZodDto } from 'nestjs-zod';
import { STUDENT_CONSTANT } from 'src/shared/constants/student.constant';
import { z } from 'zod';
import { Gender } from '@prisma/client';
import { ObjectId } from 'mongodb';
import { createResponseWrapperSchema } from 'src/shared/helpers/api-response';

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
  faculty: z.enum(
    [
      STUDENT_CONSTANT.FACULTY.LAW,
      STUDENT_CONSTANT.FACULTY.BUSSINESS_ENGLISH,
      STUDENT_CONSTANT.FACULTY.JAPANESE_LANGUAGE,
      STUDENT_CONSTANT.FACULTY.FRENCH_LANGUAGE,
    ],
    {
      message: 'Invalid faculty',
    },
  ),
  course: z.number().int().min(1, 'Course must be a positive integer'),
  program: z.string().min(1, 'Program cannot be empty'),
  address: z.string().optional().nullable(),
  email: z.string().email('Invalid email format').optional().nullable(),
  phone: z.string().min(10).max(15).optional().nullable(),
  status: z.enum(
    [
      STUDENT_CONSTANT.STATUS.STUDING,
      STUDENT_CONSTANT.STATUS.GRADUATED,
      STUDENT_CONSTANT.STATUS.DISCONTINUED,
      STUDENT_CONSTANT.STATUS.TEMPORARY_SUSPENSE,
    ],
    {
      message: 'Invalid student status',
    },
  ),
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
