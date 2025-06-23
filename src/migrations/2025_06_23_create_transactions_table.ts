import { Knex } from 'knex';
import { TransactionStatus, TransactionType } from '../common/constants';

export const up = async (knex: Knex): Promise<void> => {
	return knex.schema.createTable('transactions', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
		table.uuid('senderId').notNullable().references('id').inTable('users').onDelete('SET NULL');
		table.uuid('receiverId').notNullable().references('id').inTable('users').onDelete('SET NULL');
		table.string('walletAddress').nullable();
		table.decimal('amount', 14, 2).notNullable();
		table.enum('transactionType', Object.values(TransactionType)).notNullable();
		table.enum('status', Object.values(TransactionStatus)).defaultTo(TransactionStatus.PENDING);
		table.string('reference').unique().notNullable();
		table.timestamps(true, true);
	});
};

export const down = async (knex: Knex): Promise<void> => {
	return knex.schema.dropTableIfExists('transactions');
};
