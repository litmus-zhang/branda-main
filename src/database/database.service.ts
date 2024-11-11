import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { BrandModel, UserModel, WorkspaceModel } from './entities';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject('UserModel') private User: ModelClass<UserModel>,
    @Inject('BrandModel') private Brand: ModelClass<BrandModel>,
    @Inject('WorkspaceModel') private Workspace: ModelClass<WorkspaceModel>,
  ) {}

  async cleanDB() {
    console.log('Cleaning the database');
    // using knex to clean the database
    await this.Brand.query().delete();
    await this.Workspace.query().delete();
    await this.User.query().delete();
    console.log('Database cleaned');
  }
}
