import { z } from 'zod';
export const AddressValidationSchema = z.object({
  id: z.string().uuid().optional(), // Optional since it's auto-generated
  addressLineOne: z.string().min(1, 'Address Line One is required'),
  addressLineTwo: z.string().optional(),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal Code is required'),
  createdAt: z.date().optional(), // Optional since it's auto-generated
  updatedAt: z.date().optional(), // Optional since it's auto-generated
  userId: z.string().uuid().optional(), // Optional
  businessId: z.string().uuid().optional(), // Optional
});
