import { BadRequestException, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { BaseService } from '@/common/services/base.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { Prisma } from '@/generated/prisma/client';

import type { BookCategory } from '@/generated/prisma/client';

@Injectable()
export class BookCategoryService extends BaseService {
	constructor(
		private readonly prisma: PrismaService,
		readonly logger: PinoLogger,
	) {
		super(logger);
	}

	getAll(): Promise<BookCategory[]> {
		return this.prisma.bookCategory.findMany();
	}

	async create(body: Prisma.BookCategoryCreateInput): Promise<BookCategory> {
		const bookCategory = await this.prisma.bookCategory.create({
			data: body,
		});

		this.logger.info(
			{
				event: 'BOOK_CATEGORY_CREATE',
				action: 'CREATE_BOOK_CATEGORY',
				bookCategoryIdTarget: bookCategory.id,
				success: true,
			},
			'Book Category created',
		);

		return bookCategory;
	}

	async update(id: number, body: Prisma.BookCategoryUpdateInput): Promise<BookCategory> {
		const bookCategory = await this.prisma.bookCategory.update({
			where: { id },
			data: body,
		});

		this.logger.info(
			{
				event: 'BOOK_CATEGORY_UPDATE',
				action: 'UPDATE_BOOK_CATEGORY',
				bookCategoryIdTarget: id,
				success: true,
			},
			'Book Category updated',
		);

		return bookCategory;
	}

	async delete(id: number): Promise<BookCategory> {
		const bookCount = await this.prisma.book.count({
			where: { bookCategoryId: id },
		});

		if (bookCount > 0) {
			this.logger.warn(
				{
					event: 'BOOK_CATEGORY_DELETE',
					action: 'CHECK_BOOK_CATEGORY_ASSOCIATED',
					bookCategoryIdTarget: id,
					success: false,
				},
				'Delete Book Category with associated Books attempt',
			);
			throw new BadRequestException('Cannot delete book category with associated books');
		}

		const deletedBookCategory = await this.prisma.bookCategory.delete({
			where: { id },
		});

		this.logger.info(
			{
				event: 'BOOK_CATEGORY_DELETE',
				action: 'DELETE_BOOK_CATEGORY',
				bookCategoryIdTarget: id,
				success: true,
			},
			'Book Category deleted',
		);

		return deletedBookCategory;
	}

	findUnique(name: string) {
		return this.prisma.bookCategory.findUnique({
			where: { name },
		});
	}
}
