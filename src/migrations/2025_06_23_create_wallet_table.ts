import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('wallets', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
		table.uuid('userId').references('id').inTable('users').onDelete('RESTRICT');
		table.integer('balance').notNullable().defaultTo(0);
		table.uuid('walletAddress').notNullable().unique().defaultTo(knex.raw('(UUID())'));
		table.boolean('isDeleted').notNullable().defaultTo(false);
		table.timestamps(true, true);
		table.unique(['userId']);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('wallets');
}
