import { MessageResponse } from '@/common/interfaces/response.interface';
import { BookCategoryData } from './data.interface';

export interface CreatedResponse extends MessageResponse {
	data: BookCategoryData;
}

export interface UpdatedResponse extends CreatedResponse {}
