import { userRepository, walletRepository } from '@/repository';
import { Request, Response } from 'express';
import {
	AppError,
	AppResponse,
	comparePassword,
	generateAccessToken,
	generateRefreshToken,
	hashPassword,
	parseTokenDuration,
	setCookie,
	toJSON,
} from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { ENVIRONMENT } from '@/common/config';

class AuthController {
	signUp = catchAsync(async (req: Request, res: Response) => {
		const { email, password, firstName, lastName, username, phoneNumber } = req.body;

		if (!firstName || !lastName || !email || !username || !password || !phoneNumber) {
			throw new AppError('Incomplete signup data', 400);
		}

		const existingUser = await userRepository.findByEmailOrUsernameOrPhone(email, username, phoneNumber);
		if (existingUser) {
			if (existingUser.email === email) {
				throw new AppError('User with this email already exists', 409);
			} else if (existingUser.username === username) {
				throw new AppError('User with this username already exists', 409);
			} else if (existingUser.phoneNumber === phoneNumber) {
				throw new AppError('User with this phone number already exists', 409);
			}
		}

		const hashedPassword = await hashPassword(password);

		await userRepository.create({
			email,
			password: hashedPassword,
			firstName,
			lastName,
			username,
			phoneNumber,
			ipAddress: req.ip,
		});
		const createdUser = await userRepository.findByEmail(email);
		if (!createdUser) {
			throw new AppError('Failed to create user', 500);
		}

		await walletRepository.create({
			userId: createdUser.id,
		});

		const accessToken = generateAccessToken(createdUser.id);
		const refreshToken = generateRefreshToken(createdUser.id);

		setCookie(req, res, 'accessToken', accessToken, parseTokenDuration(ENVIRONMENT.JWT_EXPIRES_IN.ACCESS));
		setCookie(req, res, 'refreshToken', refreshToken, parseTokenDuration(ENVIRONMENT.JWT_EXPIRES_IN.REFRESH));

		return AppResponse(res, 201, toJSON([createdUser]), 'User created successfully');
	});

	signIn = catchAsync(async (req: Request, res: Response) => {
		const { email, password } = req.body;

		if (!email || !password) {
			throw new AppError('Incomplete login data', 401);
		}

		const user = await userRepository.findByEmail(email);
		if (!user) {
			throw new AppError('User not found', 404);
		}

		const isPasswordValid = await comparePassword(password, user.password);
		if (!isPasswordValid) {
			throw new AppError('Invalid credentials', 401);
		}

		if (user.isSuspended) {
			throw new AppError('Your account is currently suspended', 401);
		}
		if (user.isDeleted) {
			throw new AppError('Your account is currently deleted', 401);
		}

		const accessToken = generateAccessToken(user.id);
		const refreshToken = generateRefreshToken(user.id);

		setCookie(req, res, 'accessToken', accessToken, parseTokenDuration(ENVIRONMENT.JWT_EXPIRES_IN.ACCESS));
		setCookie(req, res, 'refreshToken', refreshToken, parseTokenDuration(ENVIRONMENT.JWT_EXPIRES_IN.REFRESH));

		return AppResponse(res, 200, toJSON([user]), 'User logged in successfully');
	});

	signOut = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;

		if (!user) {
			throw new AppError('You are not logged in', 401);
		}

		const existingUser = await userRepository.findById(user.id);
		if (!existingUser) {
			throw new AppError('User not found', 404);
		}

		setCookie(req, res, 'accessToken', 'expired', -1);
		setCookie(req, res, 'refreshToken', 'expired', -1);

		AppResponse(res, 200, null, 'Logout successful');
	});
}

export const authController = new AuthController();
