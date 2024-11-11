import type { Knex } from 'knex';

const tableName = 'User';
const randomName = 'John Doe' + Math.floor(Math.random() * 100000);
const randomProfilePicture = `https://robohash.org/${randomName}?size=100x100?set=set5`;

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.string('firstname').notNullable();
    table.string('lastname').notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.string('profile_picture').defaultTo(randomProfilePicture);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}
