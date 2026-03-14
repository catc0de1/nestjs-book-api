import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { throttlerConstant } from './throttler.constant';
import { THROTTLER_ERROR_MSG } from './error-msg.constant';

@Module({
	imports: [
		ThrottlerModule.forRoot({
			throttlers: [
				{
					name: throttlerConstant.default.name,
					ttl: throttlerConstant.default.ttl,
					limit: throttlerConstant.default.limit,
				},
			],

			errorMessage: THROTTLER_ERROR_MSG,
		}),
	],
})
export class ThrottlerConfigModule {}
