import { faker } from '@faker-js/faker';
import { getCurrentYear } from '@/common/lib/getTime';
import { bookCategoryData } from '../data/book-category.data';
import { bookLocationData } from '../data/book-location.data';

function getRandom<T>(arr: readonly T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

export function generateBook() {
	return {
		title: faker.book.title(),
		author: faker.person.fullName(),
		year: faker.number.int({ min: 1990, max: getCurrentYear }),
		publisher: faker.company.name(),
		description: faker.lorem.sentence(),
		bookCategory: getRandom(bookCategoryData),
		bookLocation: getRandom(bookLocationData),
	};
}
