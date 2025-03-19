import { createZodDto } from 'nestjs-zod';
import { addressesSchema } from './addresses.dto';

export class CreateAddressDTO extends createZodDto(
  addressesSchema.omit({ id: true }),
) {}
