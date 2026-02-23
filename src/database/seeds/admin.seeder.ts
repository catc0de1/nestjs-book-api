import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/common/prisma/prisma.service';
import { AuthService } from '@/modules/auth/auth.service';

@Injectable()
export class AdminSeeder {
	constructor(
		private readonly prisma: PrismaService,
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {}

	async run(): Promise<void> {
		const count = await this.prisma.admin.count();

		if (count > 0) {
			console.log('Admin already exist, skipping seed');
			return;
		}

		const ADMIN_PASSWORD = this.configService.getOrThrow<string>('ADMIN_PASSWORD');

		const hashedPassword = await this.authService.encryptPassword(ADMIN_PASSWORD);

		await this.prisma.admin.create({
			data: {
				password: hashedPassword,
			},
		});

		console.log('Admin seeded successfully');
	}
}
