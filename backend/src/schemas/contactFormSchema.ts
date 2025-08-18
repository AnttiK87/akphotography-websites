import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string(),
  email: z.string(),
  message: z.string(),
  contactMe: z.boolean(),
  language: z.enum(['fin', 'eng']),
});
