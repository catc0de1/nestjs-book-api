import { loginSchema } from './login.schema';

describe('loginSchema', () => {
	const validData = {
		password: 'notAdmin123',
	};

	it('should be defined', () => {
		expect(loginSchema).toBeDefined();
	});

	describe('success cases', () => {
		it('should pass with valid data', () => {
			const result = loginSchema.safeParse(validData);

			expect(result.success).toBe(true);
		});
	});

	describe('fail cases', () => {
		describe('strict validation', () => {
			it('should throw if unknown field provided', () => {
				const result = loginSchema.safeParse({
					unknownField: 'test',
				});

				expect(result.success).toBe(false);
			});
		});

		describe('password validation', () => {
			it('should throw if password empty', () => {
				const result = loginSchema.safeParse({
					password: '',
				});

				expect(result.success).toBe(false);

				const msg = 'Password is required';
				if (!result.success) expect(result.error.issues[0].message).toBe(msg);
			});
		});
	});
});
