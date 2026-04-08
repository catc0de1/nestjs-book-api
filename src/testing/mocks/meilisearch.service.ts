export const mockMeiliIndex = {
	updateSettings: jest.fn(),
	addDocuments: jest.fn(),
	updateDocuments: jest.fn(),
	deleteDocument: jest.fn(),
};

export const mockMeilisearchService = {
	index: jest.fn().mockReturnValue(mockMeiliIndex),
	getClient: jest.fn().mockReturnValue({
		createIndex: jest.fn().mockResolvedValue({}),
	}),
	getStats: jest.fn(),
};
