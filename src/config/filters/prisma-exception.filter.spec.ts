import { PrismaExceptionFilter } from './prisma-exception.filter';
import { Prisma } from '@/generated/prisma/client';
import { ArgumentsHost } from '@nestjs/common';

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
		filter = new PrismaExceptionFilter();
		jest.clearAllMocks();
	});

	it('should handle P2002 duplicate error (default engine)', () => {
		const exception = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
			code: 'P2002',
			clientVersion: 'test',
			meta: {
				target: ['email'],
			},
		});

		filter.catch(exception, mockHost);

		expect(mockReply.status).toHaveBeenCalledWith(409);
		expect(mockReply.send).toHaveBeenCalledWith({
			statusCode: 409,
			message: 'Duplicate value on email',
			error: 'Conflict',
		});
	});

	it('should handle P2002 duplicate error (pg driver adapter)', () => {
		const exception = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
			code: 'P2002',
			clientVersion: 'test',
			meta: {
				driverAdapterError: {
					cause: {
						constraint: {
							fields: ['username'],
						},
					},
				},
			},
		});

		filter.catch(exception, mockHost);

		expect(mockReply.status).toHaveBeenCalledWith(409);
		expect(mockReply.send).toHaveBeenCalledWith({
			statusCode: 409,
			message: 'Duplicate value on username',
			error: 'Conflict',
		});
	});

	it('should handle P2025 not found error', () => {
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

	it('should handle unknown prisma error', () => {
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
