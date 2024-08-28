import type { Knex } from 'knex';
import * as dotenv from 'dotenv';

dotenv.config();

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: process.env.DEV_DATABASE_URL,
  },
  test: {
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL,
  },
  staging: {
    client: 'cockroachdb',
    connection: process.env.STAGING_DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: process.env.PROD_DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};

export default config;
