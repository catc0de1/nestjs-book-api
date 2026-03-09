import { Test, TestingModule } from '@nestjs/testing';
import { BookLocationController } from './book-location.controller';
import { BookLocationService } from './book-location.service';

describe('BookLocationController', () => {
	let controller: BookLocationController;

	const mockBookLocationService = {
		getAll: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	};

	beforeEach(async () => {
		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			controllers: [BookLocationController],
			providers: [
				{
					provide: BookLocationService,
					useValue: mockBookLocationService,
				},
			],
		}).compile();

		controller = module.get<BookLocationController>(BookLocationController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	// get all
	describe('getAll', () => {
		it('should return book locations', async () => {
			const mockResponse = [{ id: 1, name: 'A-10' }];

			mockBookLocationService.getAll.mockResolvedValue(mockResponse);

			const result = await controller.getAll();

			expect(mockBookLocationService.getAll).toHaveBeenCalledWith();
			expect(result).toEqual(mockResponse);
		});

		// create
		it('should create book location and return wrapped response', async () => {
			const dto = { name: 'A-10' };

			const createdBookLocation = { id: 1, name: dto.name };

			mockBookLocationService.create.mockResolvedValue(createdBookLocation);

			const result = await controller.create(dto);

			expect(mockBookLocationService.create).toHaveBeenCalledWith(dto);
			expect(result).toEqual({
				message: 'Book Location created successfully',
				data: createdBookLocation,
			});
		});

		// update
		it('should update book location and return wrapped response', async () => {
			const dto = { name: 'E-05' };

			const updatedBookLocation = { id: 1, name: dto.name };

			mockBookLocationService.update.mockResolvedValue(updatedBookLocation);

			const result = await controller.update(1, { name: dto.name });

			expect(mockBookLocationService.update).toHaveBeenCalledWith(1, { name: dto.name });
			expect(result).toEqual({
				message: 'Book Location updated successfully',
				data: updatedBookLocation,
			});
		});

		// delete
		it('should delete book location and return wrapped response', async () => {
			const deletedBookLocation = { id: 1, name: 'A-10' };

			mockBookLocationService.delete.mockResolvedValue(deletedBookLocation);

			const result = await controller.delete(1);

			expect(mockBookLocationService.delete).toHaveBeenCalledWith(1);
			expect(result).toEqual({
				message: 'Book Location A-10 deleted successfully',
			});
		});
	});
});
