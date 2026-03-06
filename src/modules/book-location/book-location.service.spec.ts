import { PrismaService } from '@/common/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { BookLocationService } from './book-location.service';

import { mockPrisma } from 'mocks/@/generated/prisma/client';
import { mockLogger } from '@/testing/mocks/logger';

describe('BookLocationService', () => {
	let service: BookLocationService;

	const mockBookLocations = [{ id: 1, name: 'A-10' }];

	beforeEach(async () => {
		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BookLocationService,
				{ provide: PrismaService, useValue: mockPrisma },
				{ provide: PinoLogger, useValue: mockLogger },
			],
		}).compile();

		service = module.get<BookLocationService>(BookLocationService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	// get all
	describe('getAll', () => {
		it('should return book locations', async () => {
			mockPrisma.bookLocation.findMany.mockResolvedValue(mockBookLocations);

			const result = await service.getAll();

			expect(result).toEqual(mockBookLocations);
		});
	});

	// create
	describe('create', () => {
		it('should create book location successfully', async () => {
			const createdBookLocation = { id: 1, name: 'A-10' };

			mockPrisma.bookLocation.create.mockResolvedValue(createdBookLocation);

			const result = await service.create({ name: 'A-10' });

			expect(mockLogger.info).toHaveBeenCalled();
			expect(result).toEqual(createdBookLocation);
		});
	});

	// update
	describe('update', () => {
		it('should update book location successfully', async () => {
			const updatedBookLocation = { id: 1, name: 'E-05' };

			mockPrisma.bookLocation.update.mockResolvedValue(updatedBookLocation);

			const result = await service.update(updatedBookLocation.id, { name: 'E-05' });

			expect(mockLogger.info).toHaveBeenCalled();
			expect(result).toEqual(updatedBookLocation);
		});
	});

	// delete
	describe('delete', () => {
		it('should delete book location successfully', async () => {
			const deletedBookLocation = { id: 1, name: 'E-05' };

			mockPrisma.book.count.mockResolvedValue(0);
			mockPrisma.bookLocation.delete.mockResolvedValue(deletedBookLocation);

			const result = await service.delete(deletedBookLocation.id);

			expect(mockLogger.info).toHaveBeenCalled();
			expect(result).toEqual(deletedBookLocation);
		});

		it('should throw if book location associated wih books', async () => {
			const id = 1;

			mockPrisma.book.count.mockResolvedValue(1);

			await expect(service.delete(id)).rejects.toThrow(BadRequestException);

			expect(mockPrisma.book.count).toHaveBeenCalledWith({
				where: { bookLocationId: id },
			});
			expect(mockLogger.warn).toHaveBeenCalled();
			expect(mockPrisma.bookLocation.delete).not.toHaveBeenCalled();
		});
	});

	// find unique
	describe('findUnique', () => {
		it('should find unique book location with name', async () => {
			mockPrisma.bookLocation.findUnique.mockResolvedValue({ id: 1, name: 'A-10' });

			const result = await service.findUnique('A-10');

			expect(result).toEqual({ id: 1, name: 'A-10' });
		});
	});
});
