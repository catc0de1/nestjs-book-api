import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { MeilisearchService } from '@/common/search/meilisearch.service';

import type { Stats } from 'meilisearch';
import type { HealthResponse } from './interfaces/response.interface';

@Injectable()
export class HealthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly meilisearchService: MeilisearchService,
	) {}

	private baseResponse(status: 'ok' | 'error', message?: string): HealthResponse {
		return {
			status,
			uptime: Math.floor(process.uptime()),
			timestamp: new Date().toISOString(),
			message,
		};
	}

	apiCheck(): HealthResponse {
		return this.baseResponse('ok');
	}

	async dbCheck(): Promise<HealthResponse> {
		try {
			await this.prisma.$queryRaw`SELECT 1`;
			return this.baseResponse('ok');
		} catch (_err) {
			throw new ServiceUnavailableException(this.baseResponse('error', 'Database not reachable'));
		}
	}

	async searchCheck(): Promise<HealthResponse> {
		try {
			const health = await this.meilisearchService.getClient().health();
			return this.baseResponse('ok', health.status);
		} catch (err) {
			throw new ServiceUnavailableException(
				this.baseResponse('error', `Meilisearch not reachable: ${err.message}`),
			);
		}
	}

	searchStats(): Promise<Stats> {
		return this.meilisearchService.getStats();
	}
}
