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

import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';

describe('BookController', () => {
	let controller: BookController;

	const mockBookService = {
		getAll: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [BookController],
			providers: [
				{
					provide: BookService,
					useValue: mockBookService,
				},
			],
		}).compile();

		controller = module.get<BookController>(BookController);
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	// get all
	describe('getAll', () => {
		it('should return paginated response', async () => {
			const mockResponse = {
				data: [{ id: 1, title: 'Book A' }],
				meta: { total: 1 },
			};

			mockBookService.getAll.mockResolvedValue(mockResponse);

			const result = await controller.getAll({ page: 1, limit: 10 } as any);

			expect(mockBookService.getAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
			expect(result).toEqual(mockResponse);
		});
	});

	// create
	describe('create', () => {
		it('should create book and return wrapped response', async () => {
			const dto = { title: 'Book A' } as any;

			const createdBook = { id: 1, title: 'Book A' };

			mockBookService.create.mockResolvedValue(createdBook);

			const result = await controller.create(dto);

			expect(mockBookService.create).toHaveBeenCalledWith(dto);

			expect(result).toEqual({
				message: 'Book created successfully',
				data: createdBook,
			});
		});
	});

	// update
	describe('update', () => {
		it('should update book and return wrapped response', async () => {
			const updatedBook = { id: 1, title: 'Updated' };

			mockBookService.update.mockResolvedValue(updatedBook);

			const result = await controller.update(1, { title: 'Updated' } as any);

			expect(mockBookService.update).toHaveBeenCalledWith(1, { title: 'Updated' });

			expect(result).toEqual({
				message: 'Book updated successfully',
				data: updatedBook,
			});
		});
	});

	// delete
	describe('delete', () => {
		it('should delete book and return message', async () => {
			mockBookService.delete.mockResolvedValue({ id: 1, title: 'Book A' });

			const result = await controller.delete(1);

			expect(mockBookService.delete).toHaveBeenCalledWith(1);

			expect(result).toEqual({
				message: 'Book Book A deleted successfully',
			});
		});
	});
});
