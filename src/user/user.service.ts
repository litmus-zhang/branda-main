import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { UserModel } from 'src/database/entities';

@Injectable()
export class UserService {
  constructor(@Inject('UserModel') private User: ModelClass<UserModel>) {}
  getProfile() {
    return {
      message: 'Hello World',
    };
  }
}
