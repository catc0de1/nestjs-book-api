import { z } from 'zod';

export const loginSchema = z.object({
	password: z.string().min(1, 'Password is required'),
});
export type LoginDto = z.infer<typeof loginSchema>;

export const changePasswordSchema = z.object({
	oldPassword: z.string(),
	newPassword: z
		.string()
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
			'Password must contain at least one uppercase letter, one lowercase letter, and one digit',
		)
		.min(6, 'Password must be at least 6 characters long'),
});
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
