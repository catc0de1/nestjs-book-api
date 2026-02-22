import type { MessageResponse } from '@/common/interfaces/response.interface';

export interface LoginResponse extends MessageResponse {
	payload: string;
}

export interface LogoutResponse extends MessageResponse {}

export interface ChangePasswordResponse extends MessageResponse {}
