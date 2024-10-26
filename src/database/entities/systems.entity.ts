import { BaseModel } from './base.model';

export class SystemModel extends BaseModel {
  static tableName = 'systems';
  name!: string;
  description!: string;
}
