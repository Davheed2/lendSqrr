import { ENVIRONMENT } from '@/common/config';
import type { IUser } from '@/common/interfaces';
import jwt from 'jsonwebtoken';
import AppError from './appError';
import { generateAccessToken, verifyToken } from './helper';
import { AuthenticateResult } from '../types';
import { userRepository } from '@/repository';
import { checkBlacklistedUser } from '@/middlewares';

export const authenticate = async ({
	accessToken,
	refreshToken,
}: {
	accessToken?: string;
	refreshToken?: string;
}): Promise<AuthenticateResult> => {
	if (!refreshToken) {
		throw new AppError('Unauthorized', 401);
	}

	const handleUserVerification = async (decoded: jwt.JwtPayload): Promise<IUser> => {
		const currentUser = await userRepository.findById(decoded.id);

		if (!currentUser) throw new AppError('User not found', 404);
		if (currentUser.isSuspended) throw new AppError('Your account is currently suspended', 401);
		if (currentUser.isDeleted) throw new AppError('Your account has been deleted', 404);

		const identity = currentUser.email;
		const isBlacklisted = await checkBlacklistedUser(identity);
		if (isBlacklisted) {
			await userRepository.update(currentUser.id, { isSuspended: true });
			throw new AppError('User is blacklisted', 403);
		}

		return currentUser;
	};

	const handleTokenRefresh = async () => {
		const decodeRefreshToken = await verifyToken(refreshToken, ENVIRONMENT.JWT.REFRESH_SECRET!);
		const currentUser = await handleUserVerification(decodeRefreshToken);
		const accessToken = generateAccessToken(currentUser.id);
		return { accessToken, currentUser };
	};

	try {
		if (!accessToken) return await handleTokenRefresh();

		const decodeAccessToken = await verifyToken(accessToken, ENVIRONMENT.JWT.ACCESS_SECRET!);
		const currentUser = await handleUserVerification(decodeAccessToken);
		return { currentUser };
	} catch (error) {
		if ((error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) && refreshToken) {
			try {
				return await handleTokenRefresh();
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (refreshError) {
				throw new AppError('Session expired, please log in again', 401);
			}
		}
		throw new AppError('An error occurred, please log in again', 401);
	}
};
