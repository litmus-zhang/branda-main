import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.renameTable('User', 'users');
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.renameTable('users', 'User');
}
