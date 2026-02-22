import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';
import { changePasswordSchema, loginSchema } from './auth.validator';

import type { ChangePasswordDto, LoginDto } from './auth.validator';
import type {
	ChangePasswordResponse,
	LoginResponse,
	LogoutResponse,
} from './interfaces/response.interface';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(ThrottlerGuard)
	@Public()
	@Post('login')
	async login(@Body(new ZodValidationPipe(loginSchema)) body: LoginDto): Promise<LoginResponse> {
		const payload = await this.authService.login(body);

		return {
			message: 'Login successfully',
			payload,
		};
	}

	@Post('logout')
	async logout(): Promise<LogoutResponse> {
		return {
			message: 'Logout successfully',
		};
	}

	@Post('change-password')
	async changePassword(
		@Body(new ZodValidationPipe(changePasswordSchema)) body: ChangePasswordDto,
	): Promise<ChangePasswordResponse> {
		await this.authService.changePassword(body);

		return {
			message: 'Password changed successfully',
		};
	}
}
