import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('brands', (table) => {
    table.renameColumn('createdBy', 'created_by');
    table.renameColumn('createdAt', 'created_at');
    table.renameColumn('updatedAt', 'updated_at');
  });
  await knex.schema.table('users', (table) => {
    table.renameColumn('brandId', 'brand_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('brands', (table) => {
    table.renameColumn('created_by', 'createdBy');
    table.renameColumn('created_at', 'createdAt');
    table.renameColumn('updated_at', 'updatedAt');
  });
  await knex.schema.table('users', (table) => {
    table.renameColumn('brand_id', 'brandId');
  });
}
