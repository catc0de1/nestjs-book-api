jest.mock('bcrypt', () => ({
	compare: jest.fn(),
	hash: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from '@/common/prisma/prisma.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

import { mockPrisma } from 'mocks/@/generated/prisma/client';
import { mockLogger } from '@/testing/mocks/logger';
import { mockConfigService } from '@/testing/mocks/configService';
import { expectHttpException } from '@/testing/helpers/expect-http-exception';

describe('AuthService', () => {
	let service: AuthService;

	const mockJwtService = {
		signAsync: jest.fn(),
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

	const mockAdmin = {
		id: 1,
		password: 'mockPassword',
	};

	const mockChangePasswordDto = {
		oldPassword: 'oldMockPassword',
		newPassword: 'newMockPassword',
	};

	describe('success cases', () => {
		// login
		describe('login', () => {
			it('should logged in and return accessToken', async () => {
				// findAdmin private func
				mockPrisma.admin.findFirst.mockResolvedValue(mockAdmin);

				// validatePassword private func
				(bcrypt.compare as jest.Mock).mockResolvedValue(true as never);

				mockJwtService.signAsync.mockResolvedValue('mock-token');

				const result = await service.login({
					password: mockAdmin.password,
				});

				expect(mockPrisma.admin.findFirst).toHaveBeenCalled();
				expect(mockJwtService.signAsync).toHaveBeenCalledWith({
					sub: mockAdmin.id,
				});
				expect(mockLogger.info).toHaveBeenCalledWith(
					expect.objectContaining({
						event: 'AUTH_LOGIN',
						action: 'LOGIN',
						success: true,
					}),
					'Admin logged in',
				);
				expect(result).toBe('mock-token');
			});
		});

		// logout
		describe('logout', () => {
			it('should logout successfully', async () => {
				service.logout();

				expect(mockLogger.info).toHaveBeenCalledWith(
					expect.objectContaining({
						event: 'AUTH_LOGOUT',
						action: 'LOGOUT',
						success: true,
					}),
					'Admin logged out',
				);
			});
		});

		describe('changePassword', () => {
			it('should change admin password', async () => {
				// findAdmin private func
				mockPrisma.admin.findFirst.mockResolvedValue(mockAdmin);

				// validatePassword private func
				(bcrypt.compare as jest.Mock).mockResolvedValue(true as never);

				// encryptPassword func
				(bcrypt.hash as jest.Mock).mockResolvedValue('hashednewpassword');

				await service.changePassword(mockChangePasswordDto);

				expect(mockPrisma.admin.findFirst).toHaveBeenCalled();
				expect(bcrypt.compare).toHaveBeenCalledWith(
					`${mockChangePasswordDto.oldPassword}pepper`,
					mockAdmin.password,
				);
				expect(bcrypt.hash).toHaveBeenCalledWith(`${mockChangePasswordDto.newPassword}pepper`, 10);
				expect(mockPrisma.admin.update).toHaveBeenCalledWith({
					where: { id: mockAdmin.id },
					data: { password: 'hashednewpassword' },
				});
				expect(mockLogger.info).toHaveBeenCalledWith(
					expect.objectContaining({
						event: 'AUTH_CHANGE_PASSWORD',
						action: 'CHANGE_PASSWORD',
						success: true,
					}),
					'Admin password changed',
				);
			});
		});

		// encrypt passowrd
		describe('encryptPassword', () => {
			it('should encrypt passowrd successfully', async () => {
				(bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

				const result = await service.encryptPassword('password');

				expect(bcrypt.hash).toHaveBeenCalledWith('password' + 'pepper', 10);
				expect(result).toBe('hashedpassword');
			});
		});
	});

	describe('fail cases', () => {
		// login
		describe('login', () => {
			it('should throw if admin not found', async () => {
				// findAdmin private func
				mockPrisma.admin.findFirst.mockResolvedValue(null);

				await expectHttpException(
					service.login({ password: mockAdmin.password }),
					InternalServerErrorException,
					'Admin does not exist',
				);

				expect(mockPrisma.admin.findFirst).toHaveBeenCalled();
				expect(mockLogger.error).toHaveBeenCalledWith(
					expect.objectContaining({
						event: 'AUTH_LOGIN',
						action: 'FIND_ADMIN',
						success: false,
					}),
					'Admin missing',
				);
				expect(mockJwtService.signAsync).not.toHaveBeenCalled();
			});

			it('should throw if password incorrect', async () => {
				// findAdmin private func
				mockPrisma.admin.findFirst.mockResolvedValue(mockAdmin);

				// validatePassword private func
				(bcrypt.compare as jest.Mock).mockResolvedValue(false as never);

				await expectHttpException(
					service.login({ password: mockAdmin.password }),
					UnauthorizedException,
					'Password incorrect',
				);

				expect(mockPrisma.admin.findFirst).toHaveBeenCalled();
				expect(mockLogger.warn).toHaveBeenCalledWith(
					expect.objectContaining({
						event: 'AUTH_LOGIN',
						action: 'VALIDATE_PASSWORD',
						success: false,
					}),
					'Password incorrect attempt',
				);
				expect(mockJwtService.signAsync).not.toHaveBeenCalled();
			});
		});

		// change password
		describe('changePassword', () => {
			it('should throw if admin not found', async () => {
				// findAdmin private func
				mockPrisma.admin.findFirst.mockResolvedValue(null);

				await expect(service.changePassword(mockChangePasswordDto)).rejects.toThrow(
					'Admin does not exist',
				);

				await expectHttpException(
					service.changePassword(mockChangePasswordDto),
					InternalServerErrorException,
					'Admin does not exist',
				);

				expect(mockPrisma.admin.findFirst).toHaveBeenCalled();
				expect(mockLogger.error).toHaveBeenCalledWith(
					expect.objectContaining({
						event: 'AUTH_CHANGE_PASSWORD',
						action: 'FIND_ADMIN',
						success: false,
					}),
					'Admin missing',
				);
				expect(mockPrisma.admin.update).not.toHaveBeenCalled();
			});

			it('should throw if oldPassword incorrect', async () => {
				// findAdmin private func
				mockPrisma.admin.findFirst.mockResolvedValue(mockAdmin);

				// validatePassword private func
				(bcrypt.compare as jest.Mock).mockResolvedValue(false as never);

				await expectHttpException(
					service.changePassword(mockChangePasswordDto),
					UnauthorizedException,
					'Password incorrect',
				);

				expect(mockPrisma.admin.findFirst).toHaveBeenCalled();
				expect(mockLogger.warn).toHaveBeenCalledWith(
					expect.objectContaining({
						event: 'AUTH_CHANGE_PASSWORD',
						action: 'VALIDATE_PASSWORD',
						success: false,
					}),
					'Password incorrect attempt',
				);
				expect(mockPrisma.admin.update).not.toHaveBeenCalled();
			});
		});
	});
});
