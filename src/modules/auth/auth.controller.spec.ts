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

	const mockLoginDto = {
		password: 'notAdmin123',
	};

	const mockChangePasswordDto = {
		oldPassword: 'notAdmin123',
		newPassword: 'newNotAdmin123',
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
			.useValue({ canActive: jest.fn(() => true) })
			.compile();

		controller = module.get<AuthController>(AuthController);
		authService = module.get<AuthService>(AuthService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('login', () => {
		it('should return login response', async () => {
			mockAuthService.login.mockResolvedValue('mock-token');

			const result = await controller.login(mockLoginDto);

			expect(authService.login).toHaveBeenCalledWith(mockLoginDto);

			expect(result).toEqual({
				message: 'Login successfully',
				payload: 'mock-token',
			});
		});
	});

	describe('logout', () => {
		it('should logout successfully', () => {
			const result = controller.logout();

			expect(authService.logout).toHaveBeenCalled();

			expect(result).toEqual({
				message: 'Logout successfully',
			});
		});
	});

	describe('changePassword', () => {
		it('should change password successfully', async () => {
			mockAuthService.changePassword.mockResolvedValue(undefined);

			const result = await controller.changePassword(mockChangePasswordDto);

			expect(authService.changePassword).toHaveBeenCalledWith(mockChangePasswordDto);

			expect(result).toEqual({
				message: 'Password changed successfully',
			});
		});
	});
});
