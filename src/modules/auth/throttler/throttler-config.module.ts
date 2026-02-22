import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { throttlerConstant } from './throttler.constant';

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

			errorMessage: 'Limit reached, try again later',
		}),
	],
})
export class ThrottlerConfigModule {}
