import type { MessageResponse } from '@/common/interfaces/response.interface';
import type { BookLocation } from '@/generated/prisma/client';

export interface CreatedResponse extends MessageResponse {
	data: BookLocation;
}

export interface UpdatedResponse extends CreatedResponse {}

export interface DeletedResponse extends MessageResponse {}
