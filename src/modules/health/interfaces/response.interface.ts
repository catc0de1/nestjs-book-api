export interface HealthResponse {
	status: 'ok' | 'error';
	uptime: number;
	timestamp: string;
	message?: string;
}
