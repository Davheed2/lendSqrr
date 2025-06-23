import { knexDb } from '@/common/config';
import { IWallet } from '@/common/interfaces';
import { AppError, generateUniqueTransactionReference } from '@/common/utils';

class WalletRepository {
	create = async (payload: Partial<IWallet>) => {
		return await knexDb.table('wallets').insert(payload);
	};

	findById = async (id: string): Promise<IWallet> => {
		return await knexDb.table('wallets').where({ id }).first();
	};

	findByUserId = async (userId: string): Promise<IWallet> => {
		return await knexDb.table('wallets').where({ userId }).first();
	};

	findByWalletAddress = async (walletAddress: string): Promise<IWallet> => {
		return await knexDb.table('wallets').where({ walletAddress }).first();
	};

	update = async (id: string, payload: Partial<IWallet>) => {
		return await knexDb.table('wallets').where({ id }).update(payload);
	};

	delete = async (id: string) => {
		return await knexDb.table('wallets').where({ id }).del();
	};

	getBalance = async (userId: string): Promise<IWallet> => {
		return await knexDb.table('wallets').where({ userId }).first();
	};

	fundWallet = async (userId: string, validatedAmount: number) => {
		return knexDb.transaction(async (trx) => {
			const user = await trx('users').where({ id: userId }).first();
			if (!user) {
				throw new AppError('User not found');
			}

			const wallet = await trx('wallets').where({ userId }).first();
			if (!wallet) {
				throw new AppError('Wallet not found for the user');
			}

			const currentBalance = wallet.balance;
			const newBalance = currentBalance + validatedAmount;

			await trx('wallets').where({ id: wallet.id }).update({ balance: newBalance });

			const reference = generateUniqueTransactionReference();
			await trx('transactions').insert({
				senderId: userId,
				receiverId: userId,
				amount: validatedAmount,
				transactionType: 'deposit',
				status: 'completed',
				walletAddress: wallet.walletAddress,
				reference,
			});

			const transaction = await trx('transactions').where({ reference }).first();
			if (!transaction) {
				throw new AppError('Transaction creation failed', 500);
			}

			return transaction;
		});
	};

	transferMoneyToUser = async (senderId: string, walletAddress: string, validatedAmount: number) => {
		return knexDb.transaction(async (trx) => {
			// const [sender, receiver] = await Promise.all([
			// 	trx('users').where({ id: senderId }).first(),
			// 	trx('users').where({ id: receiverId }).first(),
			// ]);
			const senderWallet = await trx('wallets').where({ userId: senderId }).first();
			if (!senderWallet) {
				throw new AppError('Wallet not found for the sender');
			}

			const receiver = await trx('wallets').where({ walletAddress }).first();
			if (!receiver) {
				throw new AppError('User with wallet address not found', 404);
			}
			if (senderWallet.walletAddress === walletAddress) {
				throw new AppError('Cannot transfer money to your own wallet', 400);
			}

			const senderBalance = senderWallet.balance;
			const receiverBalance = receiver.balance;
			if (senderBalance < validatedAmount) {
				throw new AppError('Insufficient balance', 400);
			}

			await trx('wallets')
				.where({ id: senderWallet.id })
				.update({ balance: senderBalance - validatedAmount });
			await trx('wallets')
				.where({ walletAddress })
				.update({ balance: receiverBalance + validatedAmount });

			const reference = generateUniqueTransactionReference();
			await trx('transactions').insert({
				senderId: senderId,
				receiverId: receiver.userId,
				walletAddress,
				amount: validatedAmount,
				transactionType: 'transfer',
				status: 'completed',
				reference,
			});

			const transaction = await trx('transactions').where({ reference }).first();
			if (!transaction) {
				throw new AppError('Transaction creation failed', 500);
			}

			return transaction;
		});
	};

	withdrawFromWallet = async (userId: string, amount: number) => {
		return knexDb.transaction(async (trx) => {
			const wallet = await trx('wallets').where({ userId }).first();
			if (!wallet) {
				throw new AppError('Wallet not found for this user');
			}
			if (wallet.balance < amount) {
				throw new AppError('Insufficient funds');
			}

			await trx('wallets')
				.where({ id: wallet.id })
				.update({ balance: wallet.balance - amount });

			const reference = generateUniqueTransactionReference();
			await trx('transactions').insert({
				senderId: userId,
				receiverId: userId,
				amount: amount,
				transactionType: 'withdraw',
				status: 'completed',
				walletAddress: wallet.walletAddress,
				reference,
			});

			const transaction = await trx('transactions').where({ reference }).first();
			if (!transaction) {
				throw new AppError('Transaction creation failed', 500);
			}

			return transaction;
		});
	};
}

export const walletRepository = new WalletRepository();
