import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('brands', function (table) {
    table.dropColumn('color_pallete');
    table.dropColumn('pattern');
    table.dropColumn('fonts');
    table.dropColumn('photography');
    table.dropColumn('illustration');
    table.dropColumn('strategy');
    table.dropColumn('messaging');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('brands', function (table) {
    table.string('color_pallete').nullable();
    table.string('pattern').nullable();
    table.string('fonts').nullable();
    table.string('photography').nullable();
    table.string('strategy').nullable();
    table.string('messaging').nullable();
    table.string('illustration').nullable();
  });
}
