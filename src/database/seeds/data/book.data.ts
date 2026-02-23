import { BookCategoryData } from './book-category.data';
import { BookLocationData } from './book-location.data';

export type BookData = {
	title: string;
	author: string;
	year: number;
	publisher: string | null;
	description: string | null;
	bookCategory: BookCategoryData;
	bookLocation: BookLocationData;
};

export const bookData: BookData[] = [];
