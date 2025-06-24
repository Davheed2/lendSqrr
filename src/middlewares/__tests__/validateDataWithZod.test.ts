import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@/common/utils';

const safeParseMock = jest.fn();

jest.mock('@/schemas', () => ({
	partialMainSchema: { safeParse: safeParseMock },
	mainSchema: {},
}));

import { validateDataWithZod } from '@/middlewares/validateDataWithZod';

const fakeReq = (overrides: Partial<Request> = {}): Request =>
	({
		method: 'POST',
		url: '/any',
		body: {},
		...overrides,
	}) as unknown as Request;

const fakeRes = (): Response => ({}) as unknown as Response;

const fakeNext = (): jest.MockedFunction<NextFunction> => jest.fn() as unknown as jest.MockedFunction<NextFunction>;

function isAppError(e: any): e is AppError {
	return e instanceof AppError;
}

describe('validateDataWithZod middleware', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('skips validation for GET requests', async () => {
		const req = fakeReq({ method: 'GET' });
		const res = fakeRes();
		const next = fakeNext();

		validateDataWithZod(req, res, next);
		await Promise.resolve();

		expect(safeParseMock).not.toHaveBeenCalled();
		expect(next).toHaveBeenCalledWith();
	});

	it('skips validation for /api/v1/auth/sign-in route', async () => {
		const req = fakeReq({ url: '/api/v1/auth/sign-in' });
		const res = fakeRes();
		const next = fakeNext();

		validateDataWithZod(req, res, next);
		await Promise.resolve();

		expect(safeParseMock).not.toHaveBeenCalled();
		expect(next).toHaveBeenCalledWith();
	});

	it('forwards AppError (422) when validation fails', async () => {
		const zodError = {
			formErrors: { fieldErrors: { email: ['Required'] } },
		};
		safeParseMock.mockReturnValue({ success: false, error: zodError });

		const req = fakeReq({ body: { email: '' } });
		const res = fakeRes();
		const next = fakeNext();

		validateDataWithZod(req, res, next);
		await Promise.resolve();

		expect(next).toHaveBeenCalledTimes(1);
		const err = next.mock.calls[0][0];
		expect(isAppError(err)).toBe(true);
		if (isAppError(err)) {
			expect(err.message).toBe('Validation failed');
			expect(err.statusCode).toBe(422);
			expect(err.data).toEqual(zodError.formErrors.fieldErrors);
		}
	});
});
