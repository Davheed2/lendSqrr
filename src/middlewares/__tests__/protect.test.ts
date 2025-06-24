import type { Request, Response, NextFunction } from 'express';
import { ENVIRONMENT } from '@/common/config';

const mockAuthenticate = jest.fn();
const mockSetCookie = jest.fn();
const mockParseDuration = jest.fn().mockReturnValue(3600);

jest.mock('@/common/utils', () => ({
	...(jest.requireActual('@/common/utils') as Record<string, unknown>),
	authenticate: mockAuthenticate,
	setCookie: mockSetCookie,
	parseTokenDuration: mockParseDuration,
}));

import { protect } from '@/middlewares/protect';

const fakeReq = (opts: Partial<Request> = {}): Request =>
	({
		cookies: {},
		headers: {},
		...opts,
	}) as unknown as Request;

const fakeRes = (): Response =>
	({
		cookie: jest.fn(),
	}) as unknown as Response;

const fakeNext = (): jest.MockedFunction<NextFunction> => jest.fn() as unknown as jest.MockedFunction<NextFunction>;

describe('protect middleware', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		ENVIRONMENT.JWT_EXPIRES_IN = { ACCESS: '1h' } as any;
	});

	it('attaches user & sets cookie when new access token is returned', async () => {
		const user = { id: 'u1' };
		mockAuthenticate.mockResolvedValue({
			currentUser: user,
			accessToken: 'newAccess',
		});

		const req = fakeReq({
			cookies: { refreshToken: 'refresh' },
		});
		const res = fakeRes();
		const next = fakeNext();

		await protect(req, res, next);

		expect(mockAuthenticate).toHaveBeenCalledWith({
			accessToken: undefined,
			refreshToken: 'refresh',
		});

		expect(mockSetCookie).toHaveBeenCalledWith(req, res, 'accessToken', 'newAccess', 3600);
		expect((req as any).user).toBe(user);
		expect(next).toHaveBeenCalledWith();
	});

	it('skips setCookie when no new access token', async () => {
		const user = { id: 'u2' };
		mockAuthenticate.mockResolvedValue({ currentUser: user });

		const req = fakeReq({
			cookies: { accessToken: 'oldAccess', refreshToken: 'refresh' },
		});
		const res = fakeRes();
		const next = fakeNext();

		await protect(req, res, next);

		expect(mockSetCookie).not.toHaveBeenCalled();
		expect((req as any).user).toBe(user);
		expect(next).toHaveBeenCalledWith();
	});
});
