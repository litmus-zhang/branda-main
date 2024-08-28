import { Model } from 'objection';
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
}

export class BrandModel extends BaseModel {
  static tableName = 'Brands';
  name!: string;
  logo!: string;
  colorPallete!: Record<string, string>;
  fonts!: Record<string, string>;
  photography!: Record<string, string>;
  illustration!: Record<string, string>;
  strategy!: Record<string, string>;
  createdAt!: Date;
  updatedAt!: Date;
}
