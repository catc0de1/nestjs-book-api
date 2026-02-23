import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';
import { FastifyRequest } from 'fastify';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly jwtService: JwtService,
		private readonly logger: PinoLogger,
	) {
		this.logger.setContext(AuthGuard.name);
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) return true;

		const request = context.switchToHttp().getRequest<FastifyRequest>();

		const method = request.method.toUpperCase();

		const protectedMethods = ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];

		if (!protectedMethods.includes(method)) return true;

		const authHeader = request.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			this.logger.warn(
				{
					event: 'JWT_AUTH_GUARD',
					action: 'CHECKING_TOKEN_AVAILABLE',
					success: false,
				},
				'Missing token',
			);
			throw new UnauthorizedException('Missing token');
		}

		const token = authHeader.split(' ')[1];

		try {
			const payload = await this.jwtService.verifyAsync(token);

			(request as any).user = payload;

			return true;
		} catch (err) {
			this.logger.warn(
				{
					event: 'JWT_AUTH_GUARD',
					action: 'VALIDATE_TOKEN',
					success: false,
					error: err,
				},
				'Invalid token, failed login atempt',
			);
			throw new UnauthorizedException('Invalid token');
		}
	}
}
