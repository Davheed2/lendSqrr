import { walletRepository } from '@/repository/walletRepository';
import { knexDb } from '@/common/config';

jest.mock('@/common/config', () => ({
	knexDb: {
		table: jest.fn(),
		transaction: jest.fn(),
	},
}));

jest.mock('@/common/utils', () => ({
	...(jest.requireActual('@/common/utils') as Record<string, unknown>),
	generateUniqueTransactionReference: jest.fn(() => 'ref-123'),
}));

type QB = {
	where: jest.Mock<any, any>;
	update: jest.Mock<any, any>;
	insert: jest.Mock<any, any>;
	del: jest.Mock<any, any>;
	first: jest.Mock<any, any>;
	select: jest.Mock<any, any>;
};

function makeQB() {
	const qb: any = {
		where: jest.fn(),
		update: jest.fn().mockResolvedValue(1),
		insert: jest.fn().mockResolvedValue([1]),
		del: jest.fn().mockResolvedValue(1),
		first: jest.fn(),
		select: jest.fn(),
	};
	qb.where.mockReturnValue(qb); // chainable
	return qb as QB;
}

const sampleUser = { id: 'u1' } as any;
const senderWallet = { id: 'w1', userId: 'u1', balance: 500, walletAddress: 'a1' } as any;
const receiverWallet = { id: 'w2', userId: 'u2', balance: 200, walletAddress: 'b1' } as any;
const sampleTx = { id: 'tx1', reference: 'ref-123' } as any;

describe('WalletRepository', () => {
	let qb: QB;

	beforeEach(() => {
		jest.clearAllMocks();
		qb = makeQB();

		(knexDb.table as jest.Mock).mockReturnValue(qb);
	});

	it('create() inserts wallet', async () => {
		const payload = { userId: 'u1' };
		qb.insert.mockResolvedValue([1]);

		const res = await walletRepository.create(payload);

		expect(knexDb.table).toHaveBeenCalledWith('wallets');
		expect(qb.insert).toHaveBeenCalledWith(payload);
		expect(res).toEqual([1]);
	});

	it('findById() returns first row', async () => {
		qb.first.mockResolvedValue(senderWallet);

		const w = await walletRepository.findById('w1');

		expect(qb.where).toHaveBeenCalledWith({ id: 'w1' });
		expect(w).toBe(senderWallet);
	});

	it('update() updates wallet', async () => {
		qb.update.mockResolvedValue(1);

		const rows = await walletRepository.update('w1', { balance: 100 });

		expect(qb.where).toHaveBeenCalledWith({ id: 'w1' });
		expect(qb.update).toHaveBeenCalledWith({ balance: 100 });
		expect(rows).toBe(1);
	});

	describe('fundWallet()', () => {
		it('credits balance and returns transaction', async () => {
			const usersQB = makeQB();
			const walletsQB = makeQB();
			const txQB = makeQB();

			usersQB.first.mockResolvedValue(sampleUser);
			walletsQB.first.mockResolvedValue({ ...senderWallet });
			txQB.insert.mockResolvedValue([1]);
			txQB.first.mockResolvedValue(sampleTx);

			const trx = jest.fn((table: string) => {
				if (table === 'users') return usersQB;
				if (table === 'wallets') return walletsQB;
				if (table === 'transactions') return txQB;
				throw new Error('unknown table');
			});

			(knexDb.transaction as jest.Mock).mockImplementation(async (cb) => cb(trx));

			const result = await walletRepository.fundWallet('u1', 100);

			expect(result).toBe(sampleTx);
			expect(walletsQB.update).toHaveBeenCalledWith({ balance: 600 });
			expect(txQB.insert).toHaveBeenCalledWith(expect.objectContaining({ transactionType: 'deposit', amount: 100 }));
		});
	});

	describe('transferMoneyToUser()', () => {
		it('moves funds and records transfer', async () => {
			const walletsQB = makeQB();
			const txQB = makeQB();

			walletsQB.first.mockResolvedValueOnce({ ...senderWallet }).mockResolvedValueOnce({ ...receiverWallet });

			txQB.insert.mockResolvedValue([1]);
			txQB.first.mockResolvedValue(sampleTx);

			const trx = jest.fn((table: string) => {
				if (table === 'wallets') return walletsQB;
				if (table === 'transactions') return txQB;
				throw new Error('unknown');
			});

			(knexDb.transaction as jest.Mock).mockImplementation(async (cb) => cb(trx));

			const res = await walletRepository.transferMoneyToUser('u1', 'b1', 100);

			expect(res).toBe(sampleTx);
			expect(walletsQB.update).toHaveBeenCalledTimes(2);
			expect(txQB.insert).toHaveBeenCalledWith(expect.objectContaining({ transactionType: 'transfer', amount: 100 }));
		});
	});

	describe('withdrawFromWallet()', () => {
		it('debets wallet and records withdrawal', async () => {
			const walletsQB = makeQB();
			const txQB = makeQB();

			walletsQB.first.mockResolvedValue({ ...senderWallet }); // balance 500
			txQB.insert.mockResolvedValue([1]);
			txQB.first.mockResolvedValue(sampleTx);

			const trx = jest.fn((table: string) => {
				if (table === 'wallets') return walletsQB;
				if (table === 'transactions') return txQB;
				throw new Error('unknown');
			});

			(knexDb.transaction as jest.Mock).mockImplementation(async (cb) => cb(trx));

			const res = await walletRepository.withdrawFromWallet('u1', 200);

			expect(res).toBe(sampleTx);
			expect(walletsQB.update).toHaveBeenCalledWith({ balance: 300 });
			expect(txQB.insert).toHaveBeenCalledWith(expect.objectContaining({ transactionType: 'withdraw', amount: 200 }));
		});
	});
});
