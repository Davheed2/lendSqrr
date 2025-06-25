import knex, { Knex } from 'knex';
import { ENVIRONMENT } from './environment';

export const knexConfig: Knex.Config = {
	client: 'mysql2',
	connection: {
		host: ENVIRONMENT.DB.HOST,
		user: ENVIRONMENT.DB.USER,
		password: ENVIRONMENT.DB.PASSWORD,
		database: ENVIRONMENT.DB.DATABASE,
		port: ENVIRONMENT.DB.PORT ? parseInt(ENVIRONMENT.DB.PORT, 10) : 3306,
		connectTimeout: 60000,
	},
	pool: {
		min: 0,
		max: 5,
		idleTimeoutMillis: 10000,
		propagateCreateError: false,
		acquireTimeoutMillis: 30000,
		reapIntervalMillis: 1000,
	},
	migrations: {
		tableName: 'knex_migrations',
		directory: process.env.NODE_ENV === 'production' ? './migrations' : './migrations',
		extension: process.env.NODE_ENV === 'production' ? 'js' : 'ts',
	},
	acquireConnectionTimeout: 60000,
	debug: true,
	log: {
		warn(message) {
			console.warn('Knex Warning:', message);
		},
		error(message) {
			console.error('Knex Error:', message);
		},
	},
};

export const knexDb = knex(knexConfig);

const DB_NAME = ENVIRONMENT.DB.DATABASE;
export const connectDb = async (): Promise<void> => {
	try {
		await knexDb.raw('SELECT 1');
		console.log(`Database connected successfully to ${DB_NAME}`);
	} catch (error) {
		console.error('Error connecting to the database: ' + (error as Error).message);
		process.exit(1);
	}
};

export const disconnectDb = async (): Promise<void> => {
	try {
		await knexDb.destroy();
		console.log('Database connection closed');
	} catch (error) {
		console.error('Error closing the database: ' + (error as Error).message);
		process.exit(1);
	}
};
