import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from '@/common/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtConfigModule } from './jwt/jwt-config.module';
import { ThrottlerConfigModule } from './throttler/throttler-config.module';
import { AuthGuard } from './guards/auth.guard';

@Module({
	imports: [JwtConfigModule, ThrottlerConfigModule],
	controllers: [AuthController],
	providers: [
		PrismaService,
		AuthService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
	exports: [AuthService],
})
export class AuthModule {}
