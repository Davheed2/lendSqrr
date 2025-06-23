import { AppError, toJSON } from '@/common/utils';
import { Request, Response } from 'express';
import { userRepository } from '@/repository/userRepository';
import { AppResponse } from '@/common/utils';
import { catchAsync } from '@/middlewares';

export class UserController {
	getUsers = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		const users = await userRepository.getAllUsers();
		if (!users || users.length === 0) {
			throw new AppError('No users found', 404);
		}

		return AppResponse(res, 200, toJSON(users), 'Users data retrieved successfully');
	});
}

export const userController = new UserController();
