import { Model, RelationMappings } from 'objection';
import { BrandModel } from './brand.entity';
import { BaseModel } from './base.model';

export class UserModel extends BaseModel {
  static tableName = 'users';
  firstname!: string;
  lastname!: string;
  email!: string;
  password!: string;
  createdAt!: Date;
  updatedAt!: Date;
  profilePicture!: string;
  brandId!: number;

  static relationMappings: RelationMappings = {
    brand: {
      relation: Model.BelongsToOneRelation,
      modelClass: BrandModel,
      join: {
        from: 'users.brandId',
        to: 'brands.id',
      },
    },
    createdBrands: {
      relation: Model.HasManyRelation,
      modelClass: BrandModel,
      join: {
        from: 'users.id',
        to: 'brands.createdBy',
      },
    },
  };
}
