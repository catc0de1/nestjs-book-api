import { Test, TestingModule } from '@nestjs/testing';
import { MeilisearchService } from '@/common/search/meilisearch.service';
import { SearchService } from './search.service';
import { SEARCH_INDEX } from './constants/search.constant';

import { mockMeiliIndex, mockMeilisearchService } from '@/testing/mocks/meilisearch.service';
import { mockBookCreatedEvent } from '@/testing/mocks/events/book-created.event';
import { mockBookUpdatedEvent } from '@/testing/mocks/events/book-updated.event';
import { mockBookDeletedEvent } from '@/testing/mocks/events/book-deleted.event';
import { mockBookCategoryUpdatedEvent } from '@/testing/mocks/events/book-category-updated.event';
import { mockBookLocationUpdatedEvent } from '@/testing/mocks/events/book-location-updated.event';

describe('SearchService', () => {
	let service: SearchService;

	beforeEach(async () => {
		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SearchService,
				{
					provide: MeilisearchService,
					useValue: mockMeilisearchService,
				},
			],
		}).compile();

		service = module.get<SearchService>(SearchService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	const indexName = SEARCH_INDEX.BOOKS;

	describe('success cases', () => {
		describe('setupIndex', () => {
			it('should create index and update settings', async () => {
				await service.setupIndex();

				expect(mockMeilisearchService.getClient().createIndex).toHaveBeenCalledWith(indexName, {
					primaryKey: 'id',
				});
				expect(mockMeiliIndex.updateSettings).toHaveBeenCalledWith(
					expect.objectContaining({
						searchableAttributes: ['title', 'author', 'description', 'publisher'],
						filterableAttributes: ['category', 'year', 'bookLocation'],
						sortableAttributes: ['year', 'createdAt'],
					}),
				);
			});
		});

		const mockMapToDocument = {
			id: mockBookCreatedEvent.book.id,
			title: mockBookCreatedEvent.book.title,
			author: mockBookCreatedEvent.book.author,
			year: mockBookCreatedEvent.book.year,
			publisher: mockBookCreatedEvent.book.publisher,
			description: mockBookCreatedEvent.book.description,
			categoryId: mockBookCreatedEvent.book.bookCategoryId,
			bookLocationId: mockBookCreatedEvent.book.bookLocationId,
			createdAt: mockBookCreatedEvent.book.createdAt.getTime(),
			category: mockBookCreatedEvent.book.category,
			bookLocation: mockBookCreatedEvent.book.bookLocation,
		};

		describe('indexBook', () => {
			it('should add book in meilisearch index', async () => {
				await service.indexBook(mockBookCreatedEvent.book);

				expect(mockMeilisearchService.index).toHaveBeenCalledWith(indexName);
				expect(mockMeiliIndex.addDocuments).toHaveBeenCalledWith([mockMapToDocument]);
			});
		});

		describe('updateBook', () => {
			it('should update book in meilisearch index', async () => {
				await service.updateBook(mockBookUpdatedEvent.book);

				expect(mockMeilisearchService.index).toHaveBeenCalledWith(indexName);
				expect(mockMeiliIndex.updateDocuments).toHaveBeenCalledWith([mockMapToDocument]);
			});
		});

		describe('updateBooksByCategory', () => {
			it('should update books by category in meilisearch index', async () => {
				await service.updateBooksByCategory(mockBookCategoryUpdatedEvent.bookCategory);

				expect(mockMeilisearchService.index).toHaveBeenCalledWith(indexName);
				expect(mockMeiliIndex.updateDocuments).toHaveBeenCalledWith([
					{ id: 1, bookCategory: 'Programming' },
					{ id: 2, bookCategory: 'Programming' },
				]);
			});
		});

		describe('updateBooksByLocation', () => {
			it('should update books by location in meilisearch index', async () => {
				await service.updateBooksByLocation(mockBookLocationUpdatedEvent.bookLocation);

				expect(mockMeilisearchService.index).toHaveBeenCalledWith(indexName);
				expect(mockMeiliIndex.updateDocuments).toHaveBeenCalledWith([
					{ id: 1, bookLocation: 'A-10' },
					{ id: 2, bookLocation: 'A-10' },
				]);
			});
		});

		describe('deleteBook', () => {
			it('should delete book in meilisearch index', async () => {
				await service.deleteBook(mockBookDeletedEvent.bookId);

				expect(mockMeilisearchService.index).toHaveBeenCalledWith(indexName);
				expect(mockMeiliIndex.deleteDocument).toHaveBeenCalledWith(mockBookDeletedEvent.bookId);
			});
		});
	});
});
