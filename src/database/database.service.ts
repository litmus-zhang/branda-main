import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { BrandModel, UserModel } from './entities';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject('UserModel') private User: ModelClass<UserModel>,
    @Inject('BrandModel') private Brand: ModelClass<BrandModel>,
  ) {}

  async cleanDB() {
    console.log('Cleaning the database');
    // using knex to clean the database
    await this.User.query().delete();
    await this.Brand.query().delete();
    console.log('Database cleaned');
  }
}
