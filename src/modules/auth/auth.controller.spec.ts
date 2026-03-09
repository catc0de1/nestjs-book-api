import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
	let controller: AuthController;
	let authService: AuthService;

	const mockAuthService = {
		login: jest.fn(),
		logout: jest.fn(),
		changePassword: jest.fn(),
	};

	beforeEach(async () => {
		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthService,
					useValue: mockAuthService,
				},
			],
		})
			.overrideGuard(ThrottlerGuard)
			.useValue({
				canActive: jest.fn(() => true),
			})
			.compile();

		controller = module.get<AuthController>(AuthController);
		authService = module.get<AuthService>(AuthService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	// login
	describe('login', () => {
		it('should login successfully and return token response', async () => {
			const dto = { password: 'mockPassword' };

			mockAuthService.login.mockResolvedValue('mock-token');

			const result = await controller.login(dto);

			expect(authService.login).toHaveBeenCalledWith(dto);

			expect(result).toEqual({
				message: 'Login successfully',
				payload: 'mock-token',
			});
		});
	});

	// logout
	describe('logout', () => {
		it('should logout successfully', () => {
			const result = controller.logout();

			expect(authService.logout).toHaveBeenCalled();

			expect(result).toEqual({
				message: 'Logout successfully',
			});
		});
	});

	// changePassword
	describe('changePassword', () => {
		it('should change password successfully', async () => {
			const dto = {
				oldPassword: 'mockOldPassword',
				newPassword: 'mockNewPassword',
			};

			mockAuthService.changePassword.mockResolvedValue(undefined);

			const result = await controller.changePassword(dto);

			expect(authService.changePassword).toHaveBeenCalledWith(dto);

			expect(result).toEqual({
				message: 'Password changed successfully',
			});
		});
	});
});
