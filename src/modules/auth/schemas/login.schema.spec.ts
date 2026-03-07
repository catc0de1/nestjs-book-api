import { loginSchema } from './login.schema';

describe('loginSchema', () => {
	it('should be defined', () => {
		expect(loginSchema).toBeDefined();
	});

	describe('success cases', () => {
		it('should pass with valid data', () => {
			const result = loginSchema.safeParse({
				password: 'notAdmin123',
			});

			expect(result.success).toBe(true);
		});
	});

	describe('fail cases', () => {
		it('should fail if password empty', () => {
			const result = loginSchema.safeParse({
				password: '',
			});

			expect(result.success).toBe(false);
		});
	});
});
