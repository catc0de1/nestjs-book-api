import { PinoLogger } from 'nestjs-pino';

export abstract class BaseService {
	constructor(protected readonly logger: PinoLogger) {
		this.logger.setContext(this.constructor.name);
	}
}
