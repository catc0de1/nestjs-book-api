import { ArgumentsHost } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaExceptionFilter } from './prisma-exception.filter';

describe('PrismaExceptionFilter', () => {
	let filter: PrismaExceptionFilter;

	const mockReply = {
		status: jest.fn().mockReturnThis(),
		send: jest.fn(),
	};

	const mockHost = {
		switchToHttp: () => ({
			getResponse: () => mockReply,
		}),
	} as unknown as ArgumentsHost;

	beforeEach(() => {
		jest.clearAllMocks();

		filter = new PrismaExceptionFilter();
	});

	it('should be defined', () => {
		expect(PrismaExceptionFilter).toBeDefined();
	});

	describe('P2002 duplicat exception', () => {
		it('should duplicate error with default engine', () => {
			const exception = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
				code: 'P2002',
				clientVersion: 'test',
				meta: {
					target: ['name'],
				},
			});

			filter.catch(exception, mockHost);

			expect(mockReply.status).toHaveBeenCalledWith(409);
			expect(mockReply.send).toHaveBeenCalledWith({
				statusCode: 409,
				message: 'Duplicate value on name',
				error: 'Conflict',
			});
		});

		it('should handle duplicate error with pg driver adapter', () => {
			const exception = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
				code: 'P2002',
				clientVersion: 'test',
				meta: {
					driverAdapterError: {
						cause: {
							constraint: {
								fields: ['name'],
							},
						},
					},
				},
			});

			filter.catch(exception, mockHost);

			expect(mockReply.status).toHaveBeenCalledWith(409);
			expect(mockReply.send).toHaveBeenCalledWith({
				statusCode: 409,
				message: 'Duplicate value on name',
				error: 'Conflict',
			});
		});
	});

	describe('P2025 not found exception', () => {
		it('should handle not found exception', () => {
			const exception = new Prisma.PrismaClientKnownRequestError('Record not found', {
				code: 'P2025',
				clientVersion: 'test',
			});

			filter.catch(exception, mockHost);

			expect(mockReply.status).toHaveBeenCalledWith(404);
			expect(mockReply.send).toHaveBeenCalledWith({
				statusCode: 404,
				message: 'Data not found',
				error: 'Not Found',
			});
		});
	});

	describe('Unknown prisma exception', () => {
		it('should handle unknown prisma exception', () => {
			const exception = new Prisma.PrismaClientKnownRequestError('Unknown error', {
				code: 'P9999',
				clientVersion: 'test',
			});

			filter.catch(exception, mockHost);

			expect(mockReply.status).toHaveBeenCalledWith(500);
			expect(mockReply.send).toHaveBeenCalledWith({
				statusCode: 500,
				message: 'Internal server error',
			});
		});
	});
});
