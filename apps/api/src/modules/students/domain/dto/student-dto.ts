import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { Gender } from '@prisma/client';
import { ObjectId } from 'mongodb';
import { BusinessRulesConfig } from 'src/config/business-rules.config';

const businessRulesConfig = new BusinessRulesConfig();
const allowedEmailDomains = businessRulesConfig.get('emailDomains');
const allowedPhoneNumber = businessRulesConfig.get('phoneRegex');
export const StudentSchema = z.object({
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
  email: z
    .string()
    .email('Invalid email format')
    .refine(
      (email) => {
        const emailDomain = email.split('@')[1];
        return allowedEmailDomains.includes(emailDomain);
      },
      {
        message: `Email must belong to one of the following domains: ${allowedEmailDomains.join(', ')}`,
      },
    ),
  phone: z
    .string()
    .min(10)
    .max(15)
    .refine((phone) => phone.match(allowedPhoneNumber), {
      message:
        'Invalid phone number format. Must follow Vietnam format: +84xxxxxxxxx or 0xxxxxxxxx',
    }),
  nationality: z.string().min(1, 'Nationality cannot be empty'),
  facultyId: z.string().min(1, 'Faculty cannot be empty'),
  permanentAddressId: z.string().optional().nullable(),
  temporaryAddressId: z.string().optional().nullable(),
  mailingAddressId: z.string().min(1, 'Mailing address cannot be empty'),
  identityPaperId: z.string().min(1, 'Identity paper cannot be empty'),
  programId: z.string().min(1, 'Program cannot be empty'),
  statusId: z.string().min(1, 'Status cannot be empty'),
});

export class StudentRequestDTO extends createZodDto(
  StudentSchema.omit({ id: true }),
) {}
export class UpdateStudentRequestDTO extends createZodDto(
  StudentSchema.omit({ studentId: true }).partial(),
) {}

export type StudentRequestType = z.infer<typeof StudentSchema>;

export class StudentDTO extends createZodDto(StudentSchema) {}

export class UpdateStudentDTO extends createZodDto(
  StudentSchema.omit({ id: true }).partial(),
) {}
