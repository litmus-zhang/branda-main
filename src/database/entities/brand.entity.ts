import { RelationMappings, Model } from 'objection';
import { UserModel } from './user.entity';
import { BaseModel } from './base.model';

export class BrandModel extends BaseModel {
  static tableName = 'brands';
  name!: string;
  logo!: string;
  colorPallete!: Record<string, string>;
  fonts!: Record<string, string>;
  photography!: Record<string, string>;
  illustration!: Record<string, string>;
  strategy!: Record<string, string>;
  messaging!: string;
  pattern!: string;
  createdBy!: number;

  static relationMappings: RelationMappings = {
    users: {
      relation: Model.HasManyRelation,
      modelClass: UserModel,
      join: {
        from: 'brands.id',
        to: 'users.brand_id',
      },
    },
    creator: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'brands.created_by',
        to: 'users.id',
      },
    },
  };
}
