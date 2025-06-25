import { AppError, toJSON } from '@/common/utils';
import { Request, Response } from 'express';
import { AppResponse } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { walletRepository } from '@/repository';

export class WalletController {
	getWalletDetails = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;

		if (!user) {
			throw new AppError('User not found', 404);
		}

		const wallet = await walletRepository.findByUserId(user.id);
		if (!wallet) {
			throw new AppError('Wallet not found', 404);
		}

		return AppResponse(res, 200, toJSON([wallet]), 'Wallet details retrieved successfully');
	});

	fundWallet = catchAsync(async (req: Request, res: Response) => {
		const { amount } = req.body;
		const { user } = req;

		if (!user) {
			throw new AppError('User not found', 404);
		}
		if (!amount) {
			throw new AppError('Amount is required to fund the wallet', 400);
		}
		if (amount <= 0) {
			throw new AppError('Please provide a valid amount', 400);
		}

		await walletRepository.fundWallet(user.id, amount);
		const balance = await walletRepository.getBalance(user.id);
		if (!balance) {
			throw new AppError('Failed to retrieve wallet balance', 500);
		}

		return AppResponse(res, 200, toJSON([balance]), 'Wallet funded successfully');
	});

	transferMoneyToUser = catchAsync(async (req: Request, res: Response) => {
		const { walletAddress, amount } = req.body;
		const { user } = req;

		if (!user) {
			throw new AppError('User not found', 404);
		}
		if (!walletAddress || !amount) {
			throw new AppError('Wallet address and amount are required', 400);
		}
		if (amount <= 0) {
			throw new AppError('Transfer amount must be greater than zero', 400);
		}

		await walletRepository.transferMoneyToUser(user.id, walletAddress, amount);

		const balance = await walletRepository.getBalance(user.id);
		if (!balance) {
			throw new AppError('Failed to retrieve wallet balance', 500);
		}

		return AppResponse(res, 200, toJSON([balance]), 'Transfer successful');
	});

	withdrawFunds = catchAsync(async (req: Request, res: Response) => {
		const { amount } = req.body;
		const { user } = req;

		if (!user) {
			throw new AppError('User not found', 404);
		}
		if (!amount) {
			throw new AppError('Amount is required for withdrawal', 400);
		}
		if (amount <= 0) {
			throw new AppError('Withdrawal amount must be greater than zero', 400);
		}

		const wallet = await walletRepository.getBalance(user.id);
		const userBalance = wallet.balance;
		if (userBalance < amount) {
			throw new AppError('Insufficient balance for withdrawal', 400);
		}

		await walletRepository.withdrawFromWallet(user.id, amount);

		const balance = await walletRepository.getBalance(user.id);
		if (!balance) {
			throw new AppError('Failed to retrieve wallet balance', 500);
		}

		return AppResponse(res, 200, toJSON([balance]), 'Withdrawal successful');
	});
}

export const walletController = new WalletController();
