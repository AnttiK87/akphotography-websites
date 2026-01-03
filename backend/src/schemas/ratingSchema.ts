import { z } from 'zod';

export const ratingSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  pictureId: z.number({ invalid_type_error: 'pictureId must be a number' }),
  rating: z
    .number()
    .int('Rating must be an integer')
    .min(0, 'Rating must be at least 0')
    .max(5, 'Rating must be at most 5'),
  update: z.boolean(),
});
