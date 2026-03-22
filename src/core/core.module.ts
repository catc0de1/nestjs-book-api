import { Module, Global } from '@nestjs/common';
import { EnvModule } from './partials/env.module';
import { LoggerModule } from './partials/logger.module';
import { MeilisearchModule } from './partials/meilisearch.module';

@Global()
@Module({
	imports: [EnvModule, LoggerModule, MeilisearchModule],
	exports: [EnvModule, LoggerModule, MeilisearchModule],
})
export class CoreModule {}
