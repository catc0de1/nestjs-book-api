import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

import type { HealthResponse } from './interfaces/response.interface';
import type { Stats } from 'meilisearch';

@Controller('health')
export class HealthController {
	constructor(private readonly healthService: HealthService) {}

	@Get()
	apiCheck(): HealthResponse {
		return this.healthService.apiCheck();
	}

	@Get('db')
	async dbCheck(): Promise<HealthResponse> {
		return this.healthService.dbCheck();
	}

	@Get('search')
	async searchCheck(): Promise<HealthResponse> {
		return this.healthService.searchCheck();
	}

	@Get('search/stats')
	async searchStats(): Promise<Stats> {
		return this.healthService.searchStats();
	}
}
