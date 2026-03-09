import { Test, TestingModule } from '@nestjs/testing';
import { BookCategoryController } from './book-category.controller';
import { BookCategoryService } from './book-category.service';

describe('BookCategoryController', () => {
	let controller: BookCategoryController;

	const mockBookCategoryService = {
		getAll: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	};

	beforeEach(async () => {
		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			controllers: [BookCategoryController],
			providers: [
				{
					provide: BookCategoryService,
					useValue: mockBookCategoryService,
				},
			],
		}).compile();

		controller = module.get<BookCategoryController>(BookCategoryController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	// get all
	describe('getAll', () => {
		it('should return book categories', async () => {
			const mockResponse = [{ id: 1, name: 'Programming' }];

			mockBookCategoryService.getAll.mockResolvedValue(mockResponse);

			const result = await controller.getAll();

			expect(mockBookCategoryService.getAll).toHaveBeenCalledWith();
			expect(result).toEqual(mockResponse);
		});

		// create
		it('should create book category and return wrapped response', async () => {
			const dto = { name: 'Programming' };

			const createdBookCategory = { id: 1, name: dto.name };

			mockBookCategoryService.create.mockResolvedValue(createdBookCategory);

			const result = await controller.create(dto);

			expect(mockBookCategoryService.create).toHaveBeenCalledWith(dto);
			expect(result).toEqual({
				message: 'Book Category created successfully',
				data: createdBookCategory,
			});
		});

		// update
		it('should update book category and return wrapped response', async () => {
			const dto = { name: 'Computer' };

			const updatedBookCategory = { id: 1, name: dto.name };

			mockBookCategoryService.update.mockResolvedValue(updatedBookCategory);

			const result = await controller.update(1, { name: dto.name });

			expect(mockBookCategoryService.update).toHaveBeenCalledWith(1, { name: dto.name });
			expect(result).toEqual({
				message: 'Book Category updated successfully',
				data: updatedBookCategory,
			});
		});

		// delete
		it('should delete book category and return wrapped response', async () => {
			const deletedBookCategory = { id: 1, name: 'Programming' };

			mockBookCategoryService.delete.mockResolvedValue(deletedBookCategory);

			const result = await controller.delete(1);

			expect(mockBookCategoryService.delete).toHaveBeenCalledWith(1);
			expect(result).toEqual({
				message: 'Book Category Programming deleted successfully',
			});
		});
	});
});
