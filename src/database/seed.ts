import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { SeederService } from './seeds/seeder.service';

async function bootstrap() {
	console.log('Seeding database...\n');

	const app = await NestFactory.createApplicationContext(SeedModule);

	const seeder = app.get(SeederService);

	await seeder.run();

	await app.close();

	console.log('\nSeeding finished');
}

bootstrap().catch((e) => {
	console.error(e);
	process.exit(1);
});
