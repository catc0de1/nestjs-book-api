import 'config/env/production';
import autocannon from 'autocannon';

export function runBench(queries: string) {
	const url = `http://localhost:${process.env.PORT}/api/book?${queries}`;

	const instance = autocannon(
		{
			url,
			connections: 10,
			duration: 30,
			requests: [
				{
					path: `/api/book?${queries}`,
					method: 'GET',
				},
			],
		},
		(err, res) => {
			if (err) {
				console.error(err);
				process.exit(1);
			}

			// Log status code distribution
			console.log('\n=== Status Code Distribution ===');
			console.log('Status Codes:', res.statusCodeStats);
			console.log('\n=== Errors ===');
			console.log('Errors:', res.errors);
		},
	);

	autocannon.track(instance, {
		renderProgressBar: true,
	});
}
