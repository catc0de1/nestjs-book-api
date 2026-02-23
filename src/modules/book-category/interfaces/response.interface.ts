import type { MessageResponse } from '@/common/interfaces/response.interface';
import type { BookCategory } from '@/generated/prisma/client';

export interface CreatedResponse extends MessageResponse {
	data: BookCategory;
}

export interface UpdatedResponse extends CreatedResponse {}

export interface DeletedResponse extends MessageResponse {}
