import { z } from 'zod';

export const businessValidatorSchema = z.object({
  id: z.string().uuid().optional(), // Optional since it's auto-generated
  name: z.string().min(1, 'Business name is required'),
  logo: z.string().optional(), // Optional
  phoneNumber: z.string().optional(), // Optional
  website: z.string().url('Website must be a valid URL').optional(), // Optional
  description: z.string().min(1, 'Description is required'),
  storeTimings: z.array(z.string()).default([]), // Optional, defaults to empty array
  ownerId: z.string().uuid('Owner ID must be a valid UUID'),
  addressId: z.string().uuid('Address ID must be a valid UUID').optional(), // Optional
});
