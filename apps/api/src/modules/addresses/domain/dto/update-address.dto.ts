import { createZodDto } from 'nestjs-zod';
import { addressesSchema } from './addresses.dto';

export class UpdateAddressDTO extends createZodDto(
  addressesSchema.omit({ id: true, createdAt: true }),
) {}
