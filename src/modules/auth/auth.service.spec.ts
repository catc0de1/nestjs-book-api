jest.mock('bcrypt', () => ({
	compare: jest.fn(),
	hash: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from '@/common/prisma/prisma.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

import { mockPrisma } from 'mocks/@/generated/prisma/client';
import { mockLogger } from '@/testing/mocks/logger';

describe('AuthService', () => {
	let service: AuthService;

	const mockJwtService = {
		signAsync: jest.fn(),
	};

	const mockConfigService = {
		getOrThrow: jest.fn(),
	};

	const mockAdmin = {
		id: 1,
		password: 'notAdmin123',
	};

	const mockValidChangePassword = {
		oldPassword: 'notAdmin123',
		newPassword: 'newNotAdmin123',
	};

	beforeEach(async () => {
		jest.clearAllMocks();

		mockConfigService.getOrThrow.mockImplementation((key: string) => {
			if (key === 'PASSWORD_PEPPER') return 'pepper';
			if (key === 'PASSWORD_SALT_ROUNDS') return 10;
		});

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: PrismaService,
					useValue: mockPrisma,
				},
				{
					provide: PinoLogger,
					useValue: mockLogger,
				},
				{
					provide: JwtService,
					useValue: mockJwtService,
				},
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	// login
	describe('login', () => {
		describe('success cases', () => {
			it('should return accessToken', async () => {
				// findAdmin private func
				mockPrisma.admin.findFirst.mockResolvedValue(mockAdmin);

				// validatePassword private func
				(bcrypt.compare as jest.Mock).mockResolvedValue(true as never);

				mockJwtService.signAsync.mockResolvedValue('mock-token');

				const result = await service.login({
					password: mockAdmin.password,
				});

				expect(mockJwtService.signAsync).toHaveBeenCalledWith({
					sub: mockAdmin.id,
				});
				expect(mockLogger.info).toHaveBeenCalled();
				expect(result).toBe('mock-token');
			});
		});

		describe('fail cases', () => {
			it('should throw if admin not found', async () => {
				// findAdmin private func
				mockPrisma.admin.findFirst.mockResolvedValue(null);

				await expect(service.login({ password: mockAdmin.password })).rejects.toThrow(
					'Admin does not exist',
				);

				expect(mockLogger.error).toHaveBeenCalled();
				expect(mockJwtService.signAsync).not.toHaveBeenCalled();
			});

			it('should throw if password incorrect', async () => {
				// findAdmin private func
				mockPrisma.admin.findFirst.mockResolvedValue(mockAdmin);

				// validatePassword private func
				(bcrypt.compare as jest.Mock).mockResolvedValue(false as never);

				await expect(service.login({ password: 'wrong password' })).rejects.toThrow(
					'Password incorrect',
				);

				expect(mockLogger.warn).toHaveBeenCalled();
				expect(mockJwtService.signAsync).not.toHaveBeenCalled();
			});
		});
	});

	// logout
	describe('logout', () => {
		it('should logout successfully', async () => {
			service.logout();

			expect(mockLogger.info).toHaveBeenCalled();
		});
	});

	// changePassword
	describe('changePassword', () => {
		describe('success cases', () => {
			it('should change admin password', async () => {
				// findAdmin private func
				mockPrisma.admin.findFirst.mockResolvedValue(mockAdmin);

				// validatePassword private func
				(bcrypt.compare as jest.Mock).mockResolvedValue(true as never);

				// encryptPassword func
				(bcrypt.hash as jest.Mock).mockResolvedValue('hashednewpassword');

				await service.changePassword(mockValidChangePassword);

				expect(bcrypt.compare).toHaveBeenCalledWith(
					`${mockValidChangePassword.oldPassword}pepper`,
					mockAdmin.password,
				);
				expect(bcrypt.hash).toHaveBeenCalledWith(
					`${mockValidChangePassword.newPassword}pepper`,
					10,
				);
				expect(mockPrisma.admin.update).toHaveBeenCalledWith({
					where: { id: mockAdmin.id },
					data: { password: 'hashednewpassword' },
				});
				expect(mockLogger.info).toHaveBeenCalled();
			});
		});

		describe('fail cases', () => {
			it('should throw if admin not found', async () => {
				// findAdmin private func
				mockPrisma.admin.findFirst.mockResolvedValue(null);

				await expect(service.changePassword(mockValidChangePassword)).rejects.toThrow(
					'Admin does not exist',
				);

				expect(mockLogger.error).toHaveBeenCalled();
				expect(mockPrisma.admin.update).not.toHaveBeenCalled();
			});

			it('should throw if oldPassword incorrect', async () => {
				// findAdmin private func
				mockPrisma.admin.findFirst.mockResolvedValue(mockAdmin);

				// validatePassword private func
				(bcrypt.compare as jest.Mock).mockResolvedValue(false as never);

				await expect(service.changePassword(mockValidChangePassword)).rejects.toThrow(
					'Password incorrect',
				);

				expect(mockLogger.warn).toHaveBeenCalled();
				expect(mockPrisma.admin.update).not.toHaveBeenCalled();
			});
		});
	});

	describe('encryptPassword', () => {
		it('should encrypt passowrd successfully', async () => {
			(bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

			const result = await service.encryptPassword('password');

			expect(bcrypt.hash).toHaveBeenCalledWith('password' + 'pepper', 10);
			expect(result).toBe('hashedpassword');
		});
	});
});
