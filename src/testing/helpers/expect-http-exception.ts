import { HttpException } from '@nestjs/common';

export async function expectHttpException(
	promise: Promise<unknown>,
	exception: new (...args: unknown[]) => HttpException,
	expectedMessage?: string,
) {
	try {
		await promise;
		throw new Error('Expected promise to throw HttpException');
	} catch (err) {
		expect(err).toBeInstanceOf(exception);

		if (expectedMessage) {
			const response = (err as HttpException).getResponse();

			if (typeof response === 'string') {
				expect(response).toBe(expectedMessage);
			} else {
				expect(response).toMatchObject({
					message: expectedMessage,
				});
			}
		}
	}
}
