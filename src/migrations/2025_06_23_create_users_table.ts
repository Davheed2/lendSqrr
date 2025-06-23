import { Role } from '@/common/constants';
import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
	return knex.schema.createTable('users', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
		table.string('firstName').notNullable().checkLength('>=', 2).checkLength('<=', 50);
		table.string('lastName').notNullable().checkLength('>=', 2).checkLength('<=', 50);
		table.string('username').notNullable().unique();
		table.string('phoneNumber').notNullable().unique().checkLength('>=', 10);
		table.string('email').notNullable().unique();
		table.string('password').notNullable();
		table.enu('role', Object.values(Role)).defaultTo(Role.User);
		table.string('ipAddress');
		table.boolean('isDeleted').defaultTo(false);
		table.boolean('isSuspended').defaultTo(false);
		table.timestamps(true, true);
	});
};

export const down = async (knex: Knex): Promise<void> => {
	return knex.schema.dropTableIfExists('users');
};
