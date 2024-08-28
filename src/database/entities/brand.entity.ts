import { RelationMappings, Model } from 'objection';
import { UserModel } from './user.entity';
import { BaseModel } from './base.model';

export class BrandModel extends BaseModel {
  static tableName = 'brands';
  name!: string;
  logo!: string;
  colorPallete!: Record<string, string>;
  fonts!: Record<string, string>;
  createdBy!: number;

  static relationMappings: RelationMappings = {
    users: {
      relation: Model.HasManyRelation,
      modelClass: UserModel,
      join: {
        from: 'brands.id',
        to: 'users.brandId',
      },
    },
    creator: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'brands.createdBy',
        to: 'users.id',
      },
    },
  };
}
