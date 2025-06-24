import { userRepository } from '@/repository/userRepository';
import { knexDb } from '@/common/config';

jest.mock('@/common/config', () => ({
	knexDb: { table: jest.fn() },
}));

type QB = {
	insert: jest.Mock;
	where: jest.Mock;
	orWhere: jest.Mock;
	update: jest.Mock;
	del: jest.Mock;
	select: jest.Mock;
	first: jest.Mock;
};

function buildMockQueryBuilder() {
	const qb: any = {
		insert: jest.fn(),
		where: jest.fn(),
		orWhere: jest.fn(),
		update: jest.fn(),
		del: jest.fn(),
		select: jest.fn(),
		first: jest.fn(),
	};

	qb.where.mockReturnValue(qb);
	qb.orWhere.mockReturnValue(qb);

	return qb as QB;
}

const sampleUser = {
	id: 'user-id',
	username: 'john',
	email: 'john@example.com',
	phoneNumber: '0800',
} as any;

describe('UserRepository', () => {
	let qb: QB;

	beforeEach(() => {
		jest.clearAllMocks();
		qb = buildMockQueryBuilder();
		(knexDb.table as jest.Mock).mockReturnValue(qb);
	});

	it('create() inserts a new user', async () => {
		qb.insert.mockResolvedValue([1]);

		const payload = { username: 'john' };
		const result = await userRepository.create(payload);

		expect(knexDb.table).toHaveBeenCalledWith('users');
		expect(qb.insert).toHaveBeenCalledWith(payload);
		expect(result).toEqual([1]);
	});

	it('findById() queries by id and returns first row', async () => {
		qb.first.mockResolvedValue(sampleUser);

		const result = await userRepository.findById('user-id');

		expect(qb.where).toHaveBeenCalledWith({ id: 'user-id' });
		expect(qb.first).toHaveBeenCalled();
		expect(result).toBe(sampleUser);
	});

	it('findByUsername() queries by username', async () => {
		qb.first.mockResolvedValue(sampleUser);

		await userRepository.findByUsername('john');

		expect(qb.where).toHaveBeenCalledWith({ username: 'john' });
		expect(qb.first).toHaveBeenCalled();
	});

	it('findByEmail() queries by email', async () => {
		qb.first.mockResolvedValue(sampleUser);

		await userRepository.findByEmail('john@example.com');

		expect(qb.where).toHaveBeenCalledWith({ email: 'john@example.com' });
		expect(qb.first).toHaveBeenCalled();
	});

	it('findByEmailOrUsernameOrPhone() queries with OR conditions', async () => {
		qb.first.mockResolvedValue(sampleUser);

		await userRepository.findByEmailOrUsernameOrPhone('john@example.com', 'john', '0800');

		expect(qb.where).toHaveBeenCalledWith({ email: 'john@example.com' });
		expect(qb.orWhere).toHaveBeenNthCalledWith(1, { username: 'john' });
		expect(qb.orWhere).toHaveBeenNthCalledWith(2, { phoneNumber: '0800' });
		expect(qb.first).toHaveBeenCalled();
	});

	it('update() updates user by id', async () => {
		qb.update.mockResolvedValue(1);

		const rows = await userRepository.update('user-id', { username: 'jane' });

		expect(qb.where).toHaveBeenCalledWith({ id: 'user-id' });
		expect(qb.update).toHaveBeenCalledWith({ username: 'jane' });
		expect(rows).toBe(1);
	});

	it('delete() removes user by id', async () => {
		qb.del.mockResolvedValue(1);

		const rows = await userRepository.delete('user-id');

		expect(qb.where).toHaveBeenCalledWith({ id: 'user-id' });
		expect(qb.del).toHaveBeenCalled();
		expect(rows).toBe(1);
	});

	it('getAllUsers() selects * from users', async () => {
		qb.select.mockResolvedValue([sampleUser]);

		const users = await userRepository.getAllUsers();

		expect(knexDb.table).toHaveBeenCalledWith('users');
		expect(qb.select).toHaveBeenCalledWith('*');
		expect(users).toEqual([sampleUser]);
	});
});
