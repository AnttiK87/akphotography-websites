import { z } from 'zod';

export const passwordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword1: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(128, 'Password must be at most 128 characters long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/,
        'Password must include uppercase, lowercase, number, and symbol',
      ),
    newPassword2: z.string(),
  })
  .refine((data) => data.newPassword1 === data.newPassword2, {
    message: 'New password and confirmation do not match',
    path: ['newPassword2'],
  })
  .refine((data) => data.newPassword1 !== data.oldPassword, {
    message: 'New password must differ from the old one',
    path: ['newPassword1'],
  });

export const newUserPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(128, 'Password must be at most 128 characters long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/,
        'Password must include uppercase, lowercase, number, and symbol',
      ),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Password and confirmation do not match',
    path: ['passwordConfirmation'],
  });

export const userInputSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    username: z.string().min(1, 'Username is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(128, 'Password must be at most 128 characters long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/,
        'Password must include uppercase, lowercase, number, and symbol',
      ),
    passwordConfirmation: z.string(),
    email: z.string().email('Invalid email format'),
    role: z.string().min(1, 'Role is required'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Password and confirmation do not match',
    path: ['passwordConfirmation'],
  });

export const userInfoUpdateSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
});
