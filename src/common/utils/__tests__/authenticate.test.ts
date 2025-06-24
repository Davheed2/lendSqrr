import jwt from 'jsonwebtoken';
import { authenticate } from '@/common/utils/authenticate';
import { ENVIRONMENT } from '@/common/config';
import { userRepository } from '@/repository';
import { checkBlacklistedUser } from '@/api';
import * as helper from '@/common/utils/helper';
import type { IUser } from '@/common/interfaces';
import { Role } from '@/common/constants';

jest.mock('@/common/utils/helper');
jest.mock('@/repository');
jest.mock('@/api/karma.ts', () => ({
	checkBlacklistedUser: jest.fn(),
}));

const generateAccessToken = helper.generateAccessToken as jest.Mock;
const verifyToken = helper.verifyToken as jest.Mock;
const findById = userRepository.findById as jest.Mock;
const updateUser = userRepository.update as jest.Mock;
const isBlacklisted = checkBlacklistedUser as jest.Mock;

const dummyUser: IUser = {
	id: 'uuid-user-1',
	email: 'test@example.com',
	firstName: 'Test',
	lastName: 'User',
	username: 'testuser',
	password: 'hashed',
	phoneNumber: '0800',
	role: Role.User,
	ipAddress: '127.0.0.1',
	isDeleted: false,
	isSuspended: false,
	created_at: new Date(),
	updated_at: new Date(),
};

describe('authenticate()', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		ENVIRONMENT.JWT.ACCESS_SECRET = 'access-secret';
		ENVIRONMENT.JWT.REFRESH_SECRET = 'refresh-secret';
	});

	it('throws 401 when refresh token is missing', async () => {
		await expect(authenticate({} as any)).rejects.toThrow('Unauthorized');
	});

	it('returns current user when access token is valid', async () => {
		verifyToken.mockResolvedValue({ id: dummyUser.id });
		findById.mockResolvedValue(dummyUser);
		isBlacklisted.mockResolvedValue(false);

		const result = await authenticate({
			accessToken: 'validAccess',
			refreshToken: 'validRefresh',
		});

		expect(result.currentUser).toEqual(dummyUser);
		expect(result.accessToken).toBeUndefined();
	});

	it('refreshes access token when it is missing but refresh token valid', async () => {
		verifyToken.mockResolvedValue({ id: dummyUser.id });
		generateAccessToken.mockReturnValue('newAccessToken');
		findById.mockResolvedValue(dummyUser);
		isBlacklisted.mockResolvedValue(false);

		const result = await authenticate({ refreshToken: 'validRefresh' });

		expect(result.currentUser).toEqual(dummyUser);
		expect(result.accessToken).toBe('newAccessToken');
		expect(generateAccessToken).toHaveBeenCalledWith(dummyUser.id);
	});

	it('suspends and rejects user if blacklisted', async () => {
		verifyToken.mockResolvedValue({ id: dummyUser.id });
		findById.mockResolvedValue(dummyUser);
		isBlacklisted.mockResolvedValue(true);

		await expect(
			authenticate({
				accessToken: 'any',
				refreshToken: 'validRefresh',
			})
		).rejects.toThrow('An error occurred, please log in again');

		expect(updateUser).toHaveBeenCalledWith(dummyUser.id, { isSuspended: true });
	});

	it('uses refresh token if access token expired', async () => {
		verifyToken
			.mockImplementationOnce(() => {
				throw new jwt.TokenExpiredError('jwt expired', new Date());
			})
			.mockResolvedValueOnce({ id: dummyUser.id });

		generateAccessToken.mockReturnValue('newAccessToken');
		findById.mockResolvedValue(dummyUser);
		isBlacklisted.mockResolvedValue(false);

		const result = await authenticate({
			accessToken: 'expiredAccess',
			refreshToken: 'validRefresh',
		});

		expect(result.currentUser).toEqual(dummyUser);
		expect(result.accessToken).toBe('newAccessToken');
	});
});
