import { Injectable } from '@nestjs/common';
import { AdminSeeder } from './admin.seeder';
import { BookLocationSeeder } from './book-location.seeder';
import { BookCategorySeeder } from './book-category.seeder';
import { BookSeeder } from './book.seeder';

@Injectable()
export class SeederService {
	constructor(
		private readonly adminSeeder: AdminSeeder,
		private readonly bookCategorySeeder: BookCategorySeeder,
		private readonly bookLocationSeeder: BookLocationSeeder,
		private readonly bookSeeder: BookSeeder,
	) {}

	async run(): Promise<void> {
		await this.adminSeeder.run();
		await this.bookCategorySeeder.run();
		await this.bookLocationSeeder.run();
		await this.bookSeeder.run();
	}
}
