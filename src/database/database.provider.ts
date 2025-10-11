import Knex from 'knex';
import { knexSnakeCaseMappers, Model } from 'objection';
import {
  UserModel,
  BrandModel,
  WorkspaceModel,
  SystemModel,
  IntegrationModel,
} from './entities';

import config from '../../knexfile';

const environment = process.env.NODE_ENV || 'development';
const knex_Config = config[environment];

const models = [
  UserModel,
  BrandModel,
  WorkspaceModel,
  SystemModel,
  IntegrationModel,
];

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
        ...knex_Config,
        ...knexSnakeCaseMappers(),
      });
      Model.knex(knexConfig);
      return knexConfig;
    },
  },
];
