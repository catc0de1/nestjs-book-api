import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';

import type { FastifyReply } from 'fastify';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
	catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const reply = ctx.getResponse<FastifyReply>();

		// Duplicate exception filter
		if (exception.code === 'P2002') {
			const meta = exception.meta as any;

			let field = 'unique field';

			// Prisma pg driver adapter
			if (meta?.driverAdapterError?.cause?.constraint?.fields) {
				field = meta.driverAdapterError.cause.constraint.fields.join(', ');
			}

			// Prisma default engine
			// `Array.isArray(meta?.target)`
			else field = meta.target.join(', ');

			return reply.status(409).send({
				statusCode: 409,
				message: `Duplicate value on ${field}`,
				error: 'Conflict',
			});
		}

		// Not found exception filter
		if (exception.code === 'P2025') {
			return reply.status(404).send({
				statusCode: 404,
				message: `Data not found`,
				error: `Not Found`,
			});
		}

		// Default exception
		return reply.status(500).send({
			statusCode: 500,
			messsage: 'Internal server error',
		});
	}
}
