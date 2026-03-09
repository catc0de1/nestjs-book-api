import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';
import { changePasswordSchema } from './schemas/change-password.schema';
import { loginSchema } from './schemas/login.schema';

import type { ChangePasswordDto } from './schemas/change-password.schema';
import type { LoginDto } from './schemas/login.schema';
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
	logout(): LogoutResponse {
		this.authService.logout();

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
