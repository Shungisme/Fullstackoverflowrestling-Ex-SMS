import { createZodDto } from 'nestjs-zod';
import { STUDENT_CONSTANT } from 'src/shared/constants/student.constant';
import { z } from 'zod';
import { Gender } from '@prisma/client';

const StudentSchema = z.object({
  id: z.number().min(1, 'id must be a positive integer'),
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
  email: z.string().email('Invalid email format'),
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

const DeleteStudentSchema = z.object({
  isDeleted: z.boolean().default(false),
  message: z.string().optional().nullable(),
});

export class StudentRequestDTO extends createZodDto(StudentSchema) {}
export class StudentResponseDTO extends createZodDto(StudentSchema) {}
export class DeleteStudentResponseDTO extends createZodDto(
  DeleteStudentSchema,
) {}
export class UpdateStudentRequestDTO extends createZodDto(
  StudentSchema.omit({ studentId: true, email: true }),
) {}
