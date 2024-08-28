import { RelationMappings, Model } from 'objection';
import { UserModel } from './user.entity';
import { BaseModel } from './base.model';

export class BrandModel extends BaseModel {
  static tableName = 'Brands';
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
        from: 'Brands.id',
        to: 'User.brandId',
      },
    },
    creator: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'Brands.createdBy',
        to: 'User.id',
      },
    },
  };
}
