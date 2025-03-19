import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const addressesSchema = z.object({
  id: z.string().optional(),
  number: z.string().min(1, 'House number cannot be empty'),
  street: z.string().min(1, 'Street cannot be empty'),
  district: z.string().min(1, 'District cannot be empty'),
  city: z.string().min(1, 'City cannot be empty'),
  country: z.string().min(1, 'Country cannot be empty'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export class AddressesDto extends createZodDto(addressesSchema) {}
