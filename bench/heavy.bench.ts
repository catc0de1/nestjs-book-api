import { runBench } from './run';

console.log('start heavy benchmark');

runBench(`titleFilter=Code&bookCategoryFilter=Programming&yearSort=asc&page=10&limit=100`);
