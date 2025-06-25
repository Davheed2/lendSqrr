import knex, { Knex } from 'knex';
import { ENVIRONMENT } from './environment';

const knexConfig: Knex.Config = {
	client: 'mysql2',
	connection: {
		host: ENVIRONMENT.DB.HOST,
		user: ENVIRONMENT.DB.USER,
		password: ENVIRONMENT.DB.PASSWORD,
		database: ENVIRONMENT.DB.DATABASE,
		port:  ENVIRONMENT.DB.PORT ? parseInt(ENVIRONMENT.DB.PORT, 10) : 3306,
		//...(ENVIRONMENT.APP.ENV === 'production' ? { ssl: { rejectUnauthorized: true } } : {}),
	},
	pool: { min: 2, max: 10 },
		migrations: {
		tableName: 'knex_migrations',
		directory: './migrations',
		extension: ENVIRONMENT.APP.ENV === 'production' ? 'js' : 'ts',
	},
	acquireConnectionTimeout: 3000
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
