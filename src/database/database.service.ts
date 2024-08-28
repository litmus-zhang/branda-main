import { Injectable } from '@nestjs/common';
import { knex } from 'knex';

@Injectable()
export class DatabaseService {
  async cleanDB() {
    console.log('Cleaning the database');
    // using knex to clean the database
    await knex('User').del();
    await knex('Brands').del();
  }
}
