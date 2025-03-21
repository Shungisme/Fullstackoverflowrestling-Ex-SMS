import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { StudentSchema } from './student-dto';
import { addressesSchema } from './address-dto';
import { identityPapersSchema } from './identity-papers.dto';

export const CreateStudentWithAddressSchema = StudentSchema.omit({
  mailingAddressId: true,
  identityPaperId: true,
  permanentAddressId: true,
  temporaryAddressId: true,
}).extend({
  permanentAddress: addressesSchema.omit({ id: true }).optional().nullable(),
  temporaryAddress: addressesSchema.omit({ id: true }).optional().nullable(),
  mailingAddress: addressesSchema.omit({ id: true }),
  identityPaper: identityPapersSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
});

export class CreateStudentWithAddressDTO extends createZodDto(
  CreateStudentWithAddressSchema,
) {}

export type CreateStudentWithAddressType = z.infer<
  typeof CreateStudentWithAddressSchema
>;
