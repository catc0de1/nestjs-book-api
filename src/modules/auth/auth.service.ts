import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { BaseService } from '@/common/services/base.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { hash, compare } from 'bcrypt';

import type { Admin } from '@/generated/prisma/client';
import type { ChangePasswordDto, LoginDto } from './auth.validator';

@Injectable()
export class AuthService extends BaseService {
	private readonly PASSWORD_PEPPER: string;
	private readonly PASSWORD_SALT_ROUNDS: number;

	constructor(
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService,
		private configService: ConfigService,
		readonly logger: PinoLogger,
	) {
		super(logger);
		this.PASSWORD_PEPPER = this.configService.getOrThrow<string>('PASSWORD_PEPPER');
		this.PASSWORD_SALT_ROUNDS = this.configService.getOrThrow<number>('PASSWORD_SALT_ROUNDS');
	}

	async login(body: LoginDto): Promise<string> {
		const admin = await this.findAdmin('AUTH_LOGIN');

		await this.validatePassword(body.password, admin.password, 'AUTH_LOGIN');

		const payload = { sub: admin.id };

		const accessToken = await this.jwtService.signAsync(payload);

		this.logger.info(
			{
				event: 'AUTH_LOGIN',
				action: 'LOGIN',
				success: true,
			},
			'Admin logged in',
		);

		return accessToken;
	}

	logout(): void {
		this.logger.info(
			{
				event: 'AUTH_LOGOUT',
				action: 'LOGOUT',
				success: true,
			},
			'Admin logged out',
		);

		return;
	}

	async changePassword(body: ChangePasswordDto): Promise<void> {
		const admin = await this.findAdmin('AUTH_CHANGE_PASSWORD');

		const [_, hashedNewPassword] = await Promise.all([
			this.validatePassword(body.oldPassword, admin.password, 'AUTH_CHANGE_PASSWORD'),
			this.encryptPassword(body.newPassword),
		]);

		await this.prisma.admin.update({
			where: { id: admin.id },
			data: { password: hashedNewPassword },
		});

		this.logger.info(
			{
				event: 'AUTH_CHANGE_PASSWORD',
				action: 'CHANGE_PASSWORD',
				success: true,
			},
			'Admin password changed',
		);

		return;
	}

	encryptPassword(password: string): Promise<string> {
		return hash(password + this.PASSWORD_PEPPER, this.PASSWORD_SALT_ROUNDS);
	}

	private async findAdmin(eventLog: string): Promise<Admin> {
		const admin = await this.prisma.admin.findFirst();

		if (!admin) {
			this.logger.error(
				{
					event: eventLog,
					action: 'FIND_ADMIN',
					success: false,
				},
				'Admin missing',
			);
			throw new InternalServerErrorException('Admin does not exist');
		}

		return admin;
	}

	private async validatePassword(
		inputPassword: string,
		adminPassword: string,
		eventLog: string,
	): Promise<void> {
		const isValid = await compare(inputPassword + this.PASSWORD_PEPPER, adminPassword);

		if (!isValid) {
			this.logger.warn(
				{
					event: eventLog,
					action: 'VALIDATE_PASSWORD',
					success: false,
				},
				'Password incorrect attempt',
			);
			throw new UnauthorizedException('Password incorrect');
		}

		return;
	}
}
