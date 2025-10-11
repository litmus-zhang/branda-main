import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.renameTable('Brand', 'brands');
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.renameTable('brands', 'Brand');
}
