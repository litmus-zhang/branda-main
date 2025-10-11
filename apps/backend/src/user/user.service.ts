import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { CreateUserDto } from 'src/auth/dto';
import { UserModel } from 'src/database/entities';
import { ResponseStatus } from 'utils/ResponseStatus';

@Injectable()
export class UserService {
  constructor(@Inject('UserModel') private User: ModelClass<UserModel>) {}
  async updateProfile(id: number, dto: CreateUserDto): Promise<ResponseStatus> {
    await this.User.query().patchAndFetchById(id, {
      firstname: dto.firstName,
      lastname: dto.lastName,
      email: dto.email,
      password: dto.password,
    });
    return {
      message: 'User profile updated successfully',
      status: 206,
    };
  }
}
