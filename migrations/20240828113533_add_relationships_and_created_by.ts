import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('User', (table) => {
    table
      .integer('brandId')
      .unsigned()
      .references('id')
      .inTable('Brands')
      .onDelete('CASCADE');
  });

  await knex.schema.table('Brands', (table) => {
    table
      .integer('createdBy')
      .unsigned()
      .references('id')
      .inTable('User')
      .onDelete('SET NULL');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('User', (table) => {
    table.dropColumn('brandId');
  });

  await knex.schema.table('Brands', (table) => {
    table.dropColumn('createdBy');
  });
}
