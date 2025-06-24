import { knexDb } from '@/common/config';

jest.mock('@/common/config', () => ({
	knexDb: { table: jest.fn() },
}));

import { transactionRepository } from '@/repository/transactionRepository';

type QB = {
	insert: jest.Mock<any, any>;
	where: jest.Mock<any, any>;
	update: jest.Mock<any, any>;
	del: jest.Mock<any, any>;
	first: jest.Mock<any, any>;
};

function mockQueryBuilder() {
	const qb: any = {
		insert: jest.fn(),
		where: jest.fn(),
		update: jest.fn(),
		del: jest.fn(),
		first: jest.fn(),
	};
	qb.where.mockReturnValue(qb);
	return qb as QB;
}

const sampleTx = {
	id: 'tx-id',
	senderId: 'u1',
	receiverId: 'u2',
	amount: 1000,
	transactionType: 'transfer',
	status: 'completed',
	walletAddress: 'w-addr',
} as any;

describe('TransactionRepository', () => {
	let qb: QB;

	beforeEach(() => {
		jest.clearAllMocks();
		qb = mockQueryBuilder();
		(knexDb.table as jest.Mock).mockReturnValue(qb);
	});

	it('create() inserts a transaction', async () => {
		qb.insert.mockResolvedValue([1]);

		const payload = { amount: 100 };
		const result = await transactionRepository.create(payload);

		expect(knexDb.table).toHaveBeenCalledWith('transactions');
		expect(qb.insert).toHaveBeenCalledWith(payload);
		expect(result).toEqual([1]);
	});

	it('findById() returns first matching row', async () => {
		qb.first.mockResolvedValue(sampleTx);

		const tx = await transactionRepository.findById('tx-id');

		expect(qb.where).toHaveBeenCalledWith({ id: 'tx-id' });
		expect(qb.first).toHaveBeenCalled();
		expect(tx).toBe(sampleTx);
	});

	it('update() updates a transaction by id', async () => {
		qb.update.mockResolvedValue(1);

		const rows = await transactionRepository.update('tx-id', { status: 'failed' });

		expect(qb.where).toHaveBeenCalledWith({ id: 'tx-id' });
		expect(qb.update).toHaveBeenCalledWith({ status: 'failed' });
		expect(rows).toBe(1);
	});

	it('delete() removes a transaction by id', async () => {
		qb.del.mockResolvedValue(1);

		const rows = await transactionRepository.delete('tx-id');

		expect(qb.where).toHaveBeenCalledWith({ id: 'tx-id' });
		expect(qb.del).toHaveBeenCalled();
		expect(rows).toBe(1);
	});
});
