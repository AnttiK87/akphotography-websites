import { z } from 'zod';

export const pictureSchema = z.object({
  type: z.enum(['monthly', 'birds', 'nature', 'landscapes', 'mammals']),
  month: z.preprocess(
    (val) => (val !== null && val !== undefined ? Number(val) : val),
    z.number().nullable().optional(),
  ),
  year: z.preprocess(
    (val) => (val !== null && val !== undefined ? Number(val) : val),
    z.number().nullable().optional(),
  ),
  textFi: z.string().nullable().optional(),
  textEn: z.string().nullable().optional(),
  keywords: z
    .union([z.string(), z.array(z.string())])
    .nullable()
    .optional(),
});

export const pictureUpdateSchema = z.object({
  type: z.enum(['monthly', 'birds', 'nature', 'landscapes', 'mammals']),
  textFi: z.string().nullable().optional(),
  textEn: z.string().nullable().optional(),
  year: z.number().nullable().optional(),
  month: z.number().nullable().optional(),
  keywords: z
    .union([z.string(), z.array(z.string())])
    .nullable()
    .optional(),
});
