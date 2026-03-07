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
		it('should fail if oldPassword empty', () => {
			const result = changePasswordSchema.safeParse({
				...validData,
				oldPassword: null,
			});

			expect(result.success).toBe(false);
		});

		it('should fail if newPassword empty', () => {
			const result = changePasswordSchema.safeParse({
				...validData,
				newPassword: '',
			});

			expect(result.success).toBe(false);
		});

		describe('newPassword regex', () => {
			it.each([
				['not contain uppercase letter', 'notadmin123'],
				['not contain lowercase letter', 'NOTADMIN123'],
				['not contain number', 'notAdmin'],
				['not contain letters', '123456'],
				['too short', 'nA123'],
			])('should fail for invalid newPassword regex: %s', (_, newPassword) => {
				const result = changePasswordSchema.safeParse(newPassword);

				expect(result.success).toBe(false);
			});
		});
	});
});
