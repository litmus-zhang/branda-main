import { BaseModel } from './base.model';

export class IntegrationModel extends BaseModel {
  static tableName = 'integrations';
  name!: string;
  description!: string;
}
