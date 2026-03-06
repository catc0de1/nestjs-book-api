import { PrismaService } from '@/common/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { BookCategoryService } from './book-category.service';
import { PinoLogger } from 'nestjs-pino';

import { mockPrisma } from 'mocks/@/generated/prisma/client';
import { mockLogger } from '@/testing/mocks/logger';
import { BadRequestException } from '@nestjs/common';

describe('BookCategoryService', () => {
	let service: BookCategoryService;

	const mockBookCategories = [{ id: 1, name: 'Programming' }];

	beforeEach(async () => {
		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BookCategoryService,
				{ provide: PrismaService, useValue: mockPrisma },
				{ provide: PinoLogger, useValue: mockLogger },
			],
		}).compile();

		service = module.get<BookCategoryService>(BookCategoryService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	// get all
	describe('getAll', () => {
		it('should return book categories', async () => {
			mockPrisma.bookCategory.findMany.mockResolvedValue(mockBookCategories);

			const result = await service.getAll();

			expect(result).toEqual(mockBookCategories);
		});
	});

	// create
	describe('create', () => {
		it('should create book category successfully', async () => {
			const createdBookCategory = { id: 1, name: 'Programming' };

			mockPrisma.bookCategory.create.mockResolvedValue(createdBookCategory);

			const result = await service.create({ name: 'Programming' });

			expect(mockLogger.info).toHaveBeenCalled();
			expect(result).toEqual(createdBookCategory);
		});
	});

	// update
	describe('update', () => {
		it('should update book category successfully', async () => {
			const updatedBookCategory = { id: 1, name: 'Computer' };

			mockPrisma.bookCategory.update.mockResolvedValue(updatedBookCategory);

			const result = await service.update(updatedBookCategory.id, { name: 'Computer' });

			expect(mockLogger.info).toHaveBeenCalled();
			expect(result).toEqual(updatedBookCategory);
		});
	});

	// delete
	describe('delete', () => {
		it('should delete book category successfully', async () => {
			const deletedBookCategory = { id: 1, name: 'Computer' };

			mockPrisma.book.count.mockResolvedValue(0);
			mockPrisma.bookCategory.delete.mockResolvedValue(deletedBookCategory);

			const result = await service.delete(deletedBookCategory.id);

			expect(mockLogger.info).toHaveBeenCalled();
			expect(result).toEqual(deletedBookCategory);
		});

		it('should throw if book category associated wih books', async () => {
			const id = 1;

			mockPrisma.book.count.mockResolvedValue(1);

			await expect(service.delete(id)).rejects.toThrow(BadRequestException);

			expect(mockPrisma.book.count).toHaveBeenCalledWith({
				where: { bookCategoryId: id },
			});
			expect(mockLogger.warn).toHaveBeenCalled();
			expect(mockPrisma.bookCategory.delete).not.toHaveBeenCalled();
		});
	});

	// find unique
	describe('findUnique', () => {
		it('should find unique book category with name', async () => {
			mockPrisma.bookCategory.findUnique.mockResolvedValue({ id: 1, name: 'Programming' });

			const result = await service.findUnique('Programming');

			expect(result).toEqual({ id: 1, name: 'Programming' });
		});
	});
});
