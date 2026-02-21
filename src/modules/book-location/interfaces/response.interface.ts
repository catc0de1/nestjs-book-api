import { MessageResponse } from '@/common/interfaces/response.interface';
import { BookLocationData } from './data.interface';

export interface CreatedResponse extends MessageResponse {
	data: BookLocationData;
}

export interface UpdatedResponse extends CreatedResponse {}
