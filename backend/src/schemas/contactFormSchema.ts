import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string(),
  email: z.string(),
  message: z.string(),
});
