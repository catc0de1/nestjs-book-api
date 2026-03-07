import { changePasswordSchema } from './change-password.schema';

describe('changePasswordSchema', () => {
	const validData = {
		oldPassword: 'Admin123',
		newPassword: 'notAdmin123',
	};

	it('should be defined', () => {
		expect(changePasswordSchema).toBeDefined();
	});

	describe('success cases', () => {
		it('should pass with valid data', () => {
			const result = changePasswordSchema.safeParse(validData);

			expect(result.success).toBe(true);
		});
	});

	describe('fail cases', () => {
		describe('strict validation', () => {
			it('should throw if unknown field provided', () => {
				const result = changePasswordSchema.safeParse({
					...validData,
					unknownField: 'test',
				});

				expect(result.success).toBe(false);
			});
		});

		describe('oldPassword validation', () => {
			it('should throw if oldPassword null', () => {
				const result = changePasswordSchema.safeParse({
					...validData,
					oldPassword: null,
				});

				expect(result.success).toBe(false);
			});
		});

		describe('newPassword validation', () => {
			it('should throw if newPassword less than 6 chars', () => {
				const result = changePasswordSchema.safeParse({
					...validData,
					newPassword: 'aA1',
				});

				expect(result.success).toBe(false);
				const msg = 'Password must be at least 6 characters long';
				if (!result.success) expect(result.error.issues[0].message).toBe(msg);
			});

			describe('newPassword regex', () => {
				it.each([
					['not contain uppercase letter', 'notadmin123'],
					['not contain lowercase letter', 'NOTADMIN123'],
					['not contain number', 'notAdmin'],
					['not contain letters', '123456'],
				])('should throw for invalid newPassword regex: %s', (_, newPassword) => {
					const result = changePasswordSchema.safeParse({
						...validData,
						newPassword,
					});

					expect(result.success).toBe(false);

					const msg =
						'Password must contain at least one uppercase letter, one lowercase letter, and one number';
					if (!result.success) expect(result.error.issues[0].message).toBe(msg);
				});
			});
		});
	});
});
