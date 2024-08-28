import Knex from 'knex';
import { knexSnakeCaseMappers, Model } from 'objection';
import { UserModel, BrandModel } from './entities';

const models = [UserModel, BrandModel];

const modelProviders = models.map((model) => {
  return {
    provide: model.name,
    useValue: model,
  };
});

export const providers = [
  ...modelProviders,
  {
    provide: 'KnexConnection',
    useFactory: async () => {
      const knexConfig = Knex({
        client: 'pg',
        connection: process.env.DATABASE_URL,
        debug: process.env.KNEX_DEBUG === 'true',
        ...knexSnakeCaseMappers(),
      });
      Model.knex(knexConfig);
      return knexConfig;
    },
  },
];
