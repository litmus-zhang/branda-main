import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('users', (table) => {
    table
      .integer('brandId')
      .unsigned()
      .references('id')
      .inTable('brands')
      .onDelete('CASCADE');
  });

  await knex.schema.table('brands', (table) => {
    table
      .integer('createdBy')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('users', (table) => {
    table.dropColumn('brandId');
  });

  await knex.schema.table('brands', (table) => {
    table.dropColumn('createdBy');
  });
}
