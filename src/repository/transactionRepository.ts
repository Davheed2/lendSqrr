import { knexDb } from '@/common/config';
import { ITransaction } from '@/common/interfaces';

class TransactionRepository {
	create = async (payload: Partial<ITransaction>) => {
		return await knexDb.table('transactions').insert(payload);
	};

	findById = async (id: string): Promise<ITransaction> => {
		return await knexDb.table('transactions').where({ id }).first();
	};

	update = async (id: string, payload: Partial<ITransaction>) => {
		return await knexDb.table('transactions').where({ id }).update(payload);
	};

	delete = async (id: string) => {
		return await knexDb.table('transactions').where({ id }).del();
	};
}


export const transactionRepository = new TransactionRepository();
