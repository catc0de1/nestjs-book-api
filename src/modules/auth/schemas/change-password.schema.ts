import { z } from 'zod';

export const changePasswordSchema = z.strictObject({
	oldPassword: z.string(),
	newPassword: z
		.string()
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
			'Password must contain at least one uppercase letter, one lowercase letter, and one number',
		)
		.min(6, 'Password must be at least 6 characters long'),
});
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
