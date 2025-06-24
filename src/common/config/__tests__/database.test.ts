jest.mock('@/common/config/environment', () => ({
	ENVIRONMENT: {
		DB: {
			HOST: 'localhost',
			USER: 'root',
			PASSWORD: 'secret',
			DATABASE: 'test_db',
			PORT: '3306',
		},
		APP: { ENV: 'test' },
	},
}));

import { knexDb, connectDb, disconnectDb } from '@/common/config/database';

jest.mock('knex', () => {
	const mKnex: jest.Mock = jest.fn(() => ({
		raw: jest.fn(),
		destroy: jest.fn(),
	}));
	return mKnex;
});

describe('Database Connection', () => {
	let logSpy: jest.SpyInstance;
	let errSpy: jest.SpyInstance;
	let exitSpy: jest.SpyInstance;

	beforeEach(() => {
		logSpy = jest.spyOn(console, 'log').mockImplementation();
		errSpy = jest.spyOn(console, 'error').mockImplementation();
		exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('connectDb should log a success message on successful connection', async () => {
		(knexDb.raw as jest.Mock).mockResolvedValue(true);

		await connectDb();

		expect(knexDb.raw).toHaveBeenCalledWith('SELECT 1');
		expect(logSpy).toHaveBeenCalledWith('Database connected successfully to test_db');
	});

	it('connectDb should handle connection errors', async () => {
		(knexDb.raw as jest.Mock).mockRejectedValue(new Error('Connection failed'));

		await connectDb();

		expect(errSpy).toHaveBeenCalledWith('Error connecting to the database: Connection failed');
		expect(exitSpy).toHaveBeenCalledWith(1);
	});

	it('disconnectDb should log a success message on graceful shutdown', async () => {
		(knexDb.destroy as jest.Mock).mockResolvedValue(undefined);

		await disconnectDb();

		expect(logSpy).toHaveBeenCalledWith('Database connection closed');
	});

	it('disconnectDb should handle disconnection errors', async () => {
		(knexDb.destroy as jest.Mock).mockRejectedValue(new Error('Disconnection failed'));

		await disconnectDb();

		expect(errSpy).toHaveBeenCalledWith('Error closing the database: Disconnection failed');
		expect(exitSpy).toHaveBeenCalledWith(1);
	});
});
