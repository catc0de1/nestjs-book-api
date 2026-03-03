jest.mock('@/generated/prisma/client', () => {
	return {
		PrismaClient: jest.fn().mockImplementation(() => ({
			book: {
				findMany: jest.fn(),
				count: jest.fn(),
				create: jest.fn(),
				update: jest.fn(),
				delete: jest.fn(),
			},
		})),
	};
});

// jest.mock('@/common/prisma/prisma.service', () => {
// 	return {
// 		PrismaService: jest.fn().mockImplementation(() => ({
// 			book: {
// 				findMany: jest.fn(),
// 				count: jest.fn(),
// 				create: jest.fn(),
// 				update: jest.fn(),
// 				delete: jest.fn(),
// 			},
// 		})),
// 	};
// });

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BookService } from './book.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { BookCategoryService } from '@/modules/book-category/book-category.service';
import { BookLocationService } from '@/modules/book-location/book-location.service';
import { PinoLogger } from 'nestjs-pino';

describe('BookService', () => {
	let service: BookService;

	const mockPrisma = {
		book: {
			findMany: jest.fn(),
			count: jest.fn(),
			create: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
		},
	};

	const mockBookCategoryService = {
		findUnique: jest.fn(),
	};

	const mockBookLocationService = {
		findUnique: jest.fn(),
	};

	const mockLogger = {
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
		debug: jest.fn(),
		setContext: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BookService,
				{ provide: PrismaService, useValue: mockPrisma },
				{ provide: BookCategoryService, useValue: mockBookCategoryService },
				{ provide: BookLocationService, useValue: mockBookLocationService },
				{ provide: PinoLogger, useValue: mockLogger },
			],
		}).compile();

		service = module.get<BookService>(BookService);
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	// get all
	describe('getAll', () => {
		it('should return paginated books', async () => {
			const mockBooks = [{ id: 1, title: 'Test Book' }];
			mockPrisma.book.findMany.mockResolvedValue(mockBooks);
			mockPrisma.book.count.mockResolvedValue(1);

			const result = await service.getAll({
				page: 1,
				limit: 10,
				createdAtSort: null,
				titleSort: null,
				authorSort: null,
				yearSort: null,
				publisherSort: null,
				categorySort: null,
				bookLocationSort: null,
				bookCategoryFilter: null,
				bookLocationFilter: null,
				titleFilter: null,
			});

			expect(mockPrisma.book.findMany).toHaveBeenCalled();
			expect(mockPrisma.book.count).toHaveBeenCalled();
			expect(result.meta.total).toBe(1);
			expect(result.data).toEqual(mockBooks);
		});
	});

	// create
	describe('create', () => {
		const dto = {
			title: 'Book A',
			author: 'Author A',
			year: 2024,
			publisher: 'Publisher A',
			description: 'Desc',
			category: 'Fiction',
			bookLocation: 'Rack A',
		};

		it('should create book successfully', async () => {
			mockBookCategoryService.findUnique.mockResolvedValue({ name: 'Fiction' });
			mockBookLocationService.findUnique.mockResolvedValue({ name: 'Rack A' });

			const createdBook = { id: 1, ...dto };
			mockPrisma.book.create.mockResolvedValue(createdBook);

			const result = await service.create(dto);

			expect(result).toEqual(createdBook);
			expect(mockPrisma.book.create).toHaveBeenCalled();
			expect(mockLogger.info).toHaveBeenCalled();
		});

		it('should throw if category not found', async () => {
			mockBookCategoryService.findUnique.mockResolvedValue(null);

			await expect(service.create(dto)).rejects.toThrow(NotFoundException);
			expect(mockLogger.warn).toHaveBeenCalled();
		});

		it('should throw if location not found', async () => {
			mockBookCategoryService.findUnique.mockResolvedValue({ name: 'Fiction' });
			mockBookLocationService.findUnique.mockResolvedValue(null);

			await expect(service.create(dto)).rejects.toThrow(NotFoundException);
			expect(mockLogger.warn).toHaveBeenCalled();
		});
	});

	// update
	describe('update', () => {
		it('should update book successfully', async () => {
			mockBookCategoryService.findUnique.mockResolvedValue({ name: 'Fiction' });
			mockBookLocationService.findUnique.mockResolvedValue({ name: 'Rack A' });

			const updatedBook = { id: 1, title: 'Updated' };
			mockPrisma.book.update.mockResolvedValue(updatedBook);

			const result = await service.update(1, {
				title: 'Updated',
				category: 'Fiction',
				bookLocation: 'Rack A',
			});

			expect(result).toEqual(updatedBook);
			expect(mockPrisma.book.update).toHaveBeenCalled();
			expect(mockLogger.info).toHaveBeenCalled();
		});

		it('should throw if update category not found', async () => {
			mockBookCategoryService.findUnique.mockResolvedValue(null);

			await expect(service.update(1, { category: 'Unknown' })).rejects.toThrow(NotFoundException);

			expect(mockLogger.warn).toHaveBeenCalled();
		});

		it('should throw if update location not found', async () => {
			mockBookLocationService.findUnique.mockResolvedValue(null);

			await expect(service.update(1, { bookLocation: 'Unknown' })).rejects.toThrow(
				NotFoundException,
			);

			expect(mockLogger.warn).toHaveBeenCalled();
		});
	});

	// delete
	describe('delete', () => {
		it('should delete book successfully', async () => {
			const deletedBook = { id: 1, title: 'Deleted' };
			mockPrisma.book.delete.mockResolvedValue(deletedBook);

			const result = await service.delete(1);

			expect(result).toEqual(deletedBook);
			expect(mockPrisma.book.delete).toHaveBeenCalledWith({
				where: { id: 1 },
			});
			expect(mockLogger.info).toHaveBeenCalled();
		});
	});
});
