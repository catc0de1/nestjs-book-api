import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/common/prisma/prisma.service';
import { hash, compare } from 'bcrypt';

import type { Admin } from '@/generated/prisma/client';
import type { ChangePasswordDto, LoginDto } from './auth.validator';

@Injectable()
export class AuthService {
	private readonly PASSWORD_PEPPER: string;
	private readonly PASSWORD_SALT_ROUNDS: number;

	constructor(
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService,
		private configService: ConfigService,
	) {
		this.PASSWORD_PEPPER = this.configService.getOrThrow<string>('PASSWORD_PEPPER');
		this.PASSWORD_SALT_ROUNDS = this.configService.getOrThrow<number>('PASSWORD_SALT_ROUNDS');
	}

	async login(body: LoginDto): Promise<string> {
		const admin = await this.findAdmin();

		await this.validatePassword(admin.password, body.password);

		const payload = { sub: admin.id };

		const accessToken = await this.jwtService.signAsync(payload);

		return accessToken;
	}

	async changePassword(body: ChangePasswordDto): Promise<void> {
		const admin = await this.findAdmin();

		const [_, newHashedPassword] = await Promise.all([
			this.validatePassword(admin.password, body.oldPassword),
			this.encryptPassword(body.newPassword),
		]);

		await this.prisma.admin.update({
			where: { id: admin.id },
			data: { password: newHashedPassword },
		});
	}

	encryptPassword(password: string): Promise<string> {
		return hash(password + this.PASSWORD_PEPPER, this.PASSWORD_SALT_ROUNDS);
	}

	private async findAdmin(): Promise<Admin> {
		const admin = await this.prisma.admin.findFirst();

		if (!admin) throw new InternalServerErrorException('Admin does not exist');

		return admin;
	}

	private async validatePassword(inputPassword: string, adminPassword: string): Promise<void> {
		const isValid = await compare(adminPassword + this.PASSWORD_PEPPER, inputPassword);

		if (!isValid) throw new UnauthorizedException('Password incorrect');

		return;
	}
}
