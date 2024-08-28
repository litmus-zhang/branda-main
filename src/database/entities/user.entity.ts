import { Model, RelationMappings } from 'objection';
import { BrandModel } from './brand.entity';

export class BaseModel extends Model {
  readonly id!: number;
}

export class UserModel extends BaseModel {
  static tableName = 'User';
  firstname!: string;
  lastName!: string;
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
        from: 'User.brandId',
        to: 'Brands.id',
      },
    },
    createdBrands: {
      relation: Model.HasManyRelation,
      modelClass: BrandModel,
      join: {
        from: 'User.id',
        to: 'Brands.createdBy',
      },
    },
  };
}
