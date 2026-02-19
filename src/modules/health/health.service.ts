import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

import type { HealthResponse } from './interfaces/response.interface';

@Injectable()
export class HealthService {
	constructor(private readonly prisma: PrismaService) {}

	apiCheck(): HealthResponse {
		return { status: 'ok' };
	}

	async dbCheck(): Promise<HealthResponse> {
		try {
			await this.prisma.$queryRaw`SELECT 1`;
			return { status: 'ok' };
		} catch (_err) {
			return { status: 'error' };
		}
	}
}
