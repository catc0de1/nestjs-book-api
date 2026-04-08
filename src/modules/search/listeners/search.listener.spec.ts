import { Test, TestingModule } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';
import { MeilisearchService } from '@/common/search/meilisearch.service';
import { SearchListener } from './search.listener';
import { SearchService } from '../search.service';

import { mockMeilisearchService } from '@/testing/mocks/meilisearch.service';
import { mockLogger } from '@/testing/mocks/logger';
import { mockBookCreatedEvent } from '@/testing/mocks/events/book-created.event';
import { mockBookUpdatedEvent } from '@/testing/mocks/events/book-updated.event';
import { mockBookCategoryUpdatedEvent } from '@/testing/mocks/events/book-category-updated.event';
import { mockBookLocationUpdatedEvent } from '@/testing/mocks/events/book-location-updated.event';
import { mockBookDeletedEvent } from '@/testing/mocks/events/book-deleted.event';

describe('SearchListener', () => {
	let listener: SearchListener;
	let searchService: SearchService;

	const mockSearchService = {
		indexBook: jest.fn(),
		updateBook: jest.fn(),
		updateBooksByCategory: jest.fn(),
		updateBooksByLocation: jest.fn(),
		deleteBook: jest.fn(),
	};

	beforeEach(async () => {
		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SearchListener,
				{
					provide: SearchService,
					useValue: mockSearchService,
				},
				{
					provide: MeilisearchService,
					useValue: mockMeilisearchService,
				},
				{
					provide: PinoLogger,
					useValue: mockLogger,
				},
			],
		}).compile();

		listener = module.get<SearchListener>(SearchListener);
		searchService = module.get<SearchService>(SearchService);
	});

	it('should be defined', () => {
		expect(listener).toBeDefined();
	});

	describe('success cases', () => {
		describe('handleBookCreatedEvent', () => {
			it('should call indexBook when event is triggered', async () => {
				await listener.handleBookCreatedEvent(mockBookCreatedEvent);

				expect(searchService.indexBook).toHaveBeenCalledWith(mockBookCreatedEvent.book);
			});
		});

		describe('handleBookUpdatedEvent', () => {
			it('should call updateBook when event is triggered', async () => {
				await listener.handleBookUpdatedEvent(mockBookUpdatedEvent);

				expect(searchService.updateBook).toHaveBeenCalledWith(mockBookUpdatedEvent.book);
			});
		});

		describe('handleBookCategoryUpdatedEvent', () => {
			it('should call updateBooksByCategory when event is triggered', async () => {
				await listener.handleBookCategoryUpdatedEvent(mockBookCategoryUpdatedEvent);

				expect(searchService.updateBooksByCategory).toHaveBeenCalledWith(
					mockBookCategoryUpdatedEvent.bookCategory,
				);
			});
		});

		describe('handleBookLocationUpdatedEvent', () => {
			it('should call updateBooksByLocation when event is triggered', async () => {
				await listener.handleBookLocationUpdatedEvent(mockBookLocationUpdatedEvent);

				expect(searchService.updateBooksByLocation).toHaveBeenCalledWith(
					mockBookLocationUpdatedEvent.bookLocation,
				);
			});
		});

		describe('handleBookDeletedEvent', () => {
			it('should call deleteBook when event is triggered', async () => {
				await listener.handleBookDeletedEvent(mockBookDeletedEvent);

				expect(searchService.deleteBook).toHaveBeenCalledWith(mockBookDeletedEvent.bookId);
			});
		});
	});

	describe('fail cases', () => {
		const mockError = new Error('Meili error');

		describe('handleBookCreatedEvent', () => {
			it('should log error when indexBook throws error', async () => {
				mockSearchService.indexBook.mockRejectedValue(mockError);

				await listener.handleBookCreatedEvent(mockBookCreatedEvent);

				expect(mockLogger.error).toHaveBeenCalledWith(
					expect.objectContaining({
						event: 'BOOK_CREATE',
						action: 'INDEX_BOOK',
						bookIdTarget: mockBookCreatedEvent.book.id,
						success: false,
						error: mockError.message,
					}),
					'Failed to index book after creation',
				);
			});
		});

		describe('handleBookUpdatedEvent', () => {
			it('should log error when updateBook throws error', async () => {
				mockSearchService.updateBook.mockRejectedValue(mockError);

				await listener.handleBookUpdatedEvent(mockBookUpdatedEvent);

				expect(mockLogger.error).toHaveBeenCalledWith(
					expect.objectContaining({
						event: 'BOOK_UPDATE',
						action: 'UPDATE_BOOK_INDEX',
						bookIdTarget: mockBookUpdatedEvent.book.id,
						success: false,
						error: mockError.message,
					}),
					'Failed to update book index after update',
				);
			});
		});

		describe('handleBookCategoryUpdatedEvent', () => {
			it('should log error when updateBooksByCategory throws error', async () => {
				mockSearchService.updateBooksByCategory.mockRejectedValue(mockError);

				await listener.handleBookCategoryUpdatedEvent(mockBookCategoryUpdatedEvent);

				expect(mockLogger.error).toHaveBeenCalledWith(
					expect.objectContaining({
						event: 'BOOK_CATEGORY_UPDATE',
						action: 'UPDATE_BOOK_INDEXS_BY_CATEGORY',
						bookCategoryIdTarget: mockBookCategoryUpdatedEvent.bookCategory.id,
						success: false,
						error: mockError.message,
					}),
					'Failed to update book indexs by category after category update',
				);
			});
		});

		describe('handleBookLocationUpdatedEvent', () => {
			it('should log error when updateBooksByLocation throws error', async () => {
				mockSearchService.updateBooksByLocation.mockRejectedValue(mockError);

				await listener.handleBookLocationUpdatedEvent(mockBookLocationUpdatedEvent);

				expect(mockLogger.error).toHaveBeenCalledWith(
					expect.objectContaining({
						event: 'BOOK_LOCATION_UPDATE',
						action: 'UPDATE_BOOK_INDEXS_BY_LOCATION',
						bookLocationIdTarget: mockBookLocationUpdatedEvent.bookLocation.id,
						success: false,
						error: mockError.message,
					}),
					'Failed to update book indexs by location after location update',
				);
			});
		});

		describe('handleBookDeletedEvent', () => {
			it('should log error when deleteBook throws error', async () => {
				mockSearchService.deleteBook.mockRejectedValue(mockError);

				await listener.handleBookDeletedEvent(mockBookDeletedEvent);

				expect(mockLogger.error).toHaveBeenCalledWith(
					expect.objectContaining({
						event: 'BOOK_DELETE',
						action: 'DELETE_BOOK_INDEX',
						bookIdTarget: mockBookDeletedEvent.bookId,
						success: false,
						error: mockError.message,
					}),
					'Failed to delete book index after deletion',
				);
			});
		});
	});
});
