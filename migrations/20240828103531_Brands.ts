import type { Knex } from 'knex';

const tableName = 'Brand';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.string('name');
    table.string('logo');
    table.json('color_pallete').defaultTo(JSON.stringify({}));
    table.json('fonts').defaultTo(JSON.stringify({}));
    table.json('photography').defaultTo(JSON.stringify({}));
    table.json('illustration').defaultTo(JSON.stringify({}));
    table.json('strategy').defaultTo(JSON.stringify({}));
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}
