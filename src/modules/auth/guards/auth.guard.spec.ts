import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';
import { AuthGuard } from './auth.guard';

import { mockLogger } from '@/testing/mocks/logger';

describe('AuthGuard', () => {
	let guard: AuthGuard;
	let reflector: Reflector;
	let jwtService: JwtService;

	const createMockContext = (request: any): ExecutionContext =>
		({
			switchToHttp: () => ({
				getRequest: () => request,
			}),
			getHandler: jest.fn(),
			getClass: jest.fn(),
		}) as unknown as ExecutionContext;

	beforeEach(async () => {
		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthGuard,
				{
					provide: Reflector,
					useValue: {
						getAllAndOverride: jest.fn(),
					},
				},
				{
					provide: JwtService,
					useValue: {
						verifyAsync: jest.fn(),
					},
				},
				{
					provide: PinoLogger,
					useValue: mockLogger,
				},
			],
		}).compile();

		guard = module.get<AuthGuard>(AuthGuard);
		reflector = module.get<Reflector>(Reflector);
		jwtService = module.get<JwtService>(JwtService);
	});

	it('should be defined', () => {
		expect(guard).toBeDefined();
	});

	describe('canActivate', () => {
		describe('success cases', () => {
			it('should pass public route', async () => {
				jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

				const ctx = createMockContext({});

				const result = await guard.canActivate(ctx);

				expect(result).toBe(true);
			});

			it('should pass GET method', async () => {
				jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

				const ctx = createMockContext({
					method: 'GET',
					headers: {},
				});

				const result = await guard.canActivate(ctx);

				expect(result).toBe(true);
			});

			it('should pass request if token valid', async () => {
				jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

				const payload = { sub: 1 };

				jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(payload);

				const request: any = {
					method: 'POST',
					headers: {
						authorization: 'Bearer validtoken',
					},
				};

				const ctx = createMockContext(request);

				const result = await guard.canActivate(ctx);

				expect(jwtService.verifyAsync).toHaveBeenCalledWith('validtoken');
				expect(request.user).toEqual(payload);
				expect(result).toBe(true);
			});
		});

		describe('fail cases', () => {
			it('should throw if token missing', async () => {
				jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

				const ctx = createMockContext({
					method: 'POST',
					headers: {},
				});

				await expect(guard.canActivate(ctx)).rejects.toThrow(
					new UnauthorizedException('Missing token'),
				);

				expect(mockLogger.warn).toHaveBeenCalledWith(
					expect.objectContaining({
						event: 'JWT_AUTH_GUARD',
						action: 'CHECKING_TOKEN_AVAILABLE',
						success: false,
					}),
					'Missing token',
				);
			});

			it('should throw if authorization not bearer', async () => {
				jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

				const ctx = createMockContext({
					method: 'POST',
					headers: {
						authorization: 'Basic token',
					},
				});

				await expect(guard.canActivate(ctx)).rejects.toThrow(
					new UnauthorizedException('Missing token'),
				);

				expect(mockLogger.warn).toHaveBeenCalledWith(
					expect.objectContaining({
						event: 'JWT_AUTH_GUARD',
						action: 'CHECKING_TOKEN_AVAILABLE',
						success: false,
					}),
					'Missing token',
				);
			});

			it('should throw if token invalid', async () => {
				jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

				jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error('invalid token'));

				const ctx = createMockContext({
					method: 'POST',
					headers: {
						authorization: 'Bearer invalidtoken',
					},
				});

				await expect(guard.canActivate(ctx)).rejects.toThrow(
					new UnauthorizedException('Invalid token'),
				);

				expect(mockLogger.warn).toHaveBeenCalledWith(
					expect.objectContaining({
						event: 'JWT_AUTH_GUARD',
						action: 'VALIDATE_TOKEN',
						success: false,
						error: expect.any(Error),
					}),
					'Invalid token, failed login atempt',
				);
			});
		});
	});
});
