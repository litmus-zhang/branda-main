import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { UserModel } from './entities';

@Injectable()
export class DatabaseService {
  constructor(@Inject('UserModel') private User: ModelClass<UserModel>) {}

  async cleanDB() {
    console.log('Cleaning the database');
    // using knex to clean the database
    await this.User.query().delete();
    console.log('Database cleaned');
  }
}
