import { knexDb } from '@/common/config';
import { IUser } from '@/common/interfaces';

class UserRepository {
	create = async (payload: Partial<IUser>) => {
		return await knexDb.table('users').insert(payload);
	};

	findById = async (id: string): Promise<IUser> => {
		return await knexDb.table('users').where({ id }).first();
	};

	findByUsername = async (username: string) => {
		return await knexDb.table('users').where({ username }).first();
	};

	findByEmail = async (email: string): Promise<IUser> => {
		return await knexDb.table('users').where({ email }).first();
	};

	findByEmailOrUsernameOrPhone = async (
		email: string,
		username: string,
		phoneNumber: string
	): Promise<IUser | null> => {
		return await knexDb.table('users').where({ email }).orWhere({ username }).orWhere({ phoneNumber }).first();
	};

	update = async (id: string, payload: Partial<IUser>) => {
		return await knexDb.table('users').where({ id }).update(payload);
	};

	delete = async (id: string) => {
		return await knexDb.table('users').where({ id }).del();
	};

	getAllUsers = async (): Promise<IUser[]> => {
		return await knexDb.table('users').select('*');
	};
}

export const userRepository = new UserRepository();
