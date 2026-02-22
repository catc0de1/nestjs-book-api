import type { MessageResponse } from '@/common/interfaces/response.interface';
import type { Book } from '@/generated/prisma/client';

export interface PaginatedResponse {
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
	data: Book[];
}

export interface CreatedResponse extends MessageResponse {
	data: Book;
}

export interface UpdatedResponse extends CreatedResponse {}
