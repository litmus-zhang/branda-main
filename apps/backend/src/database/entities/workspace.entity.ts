import { Model, RelationMappings, RelationMappingsThunk } from 'objection';
import { BaseModel } from './base.model';
import { UserModel } from './user.entity';

export class WorkspaceModel extends BaseModel {
  static tableName = 'workspaces';
  name!: string;
  description!: string;
  createdBy!: number;

  static relationMappings: RelationMappings | RelationMappingsThunk = {
    users: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'users.model',
      join: {
        from: 'workspaces.id',
        to: 'users.workspace_id',
      },
    },
    creator: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'users.id',
        to: 'workspaces.created_by',
      },
    },
    systems: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'systems.model',
      join: {
        from: 'workspaces.id',
        to: 'systems.workspace_id',
      },
    },
  };
}
