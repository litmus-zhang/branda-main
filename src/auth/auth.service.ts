import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto';
import { UserModel } from 'src/database/entities';
import { ModelClass } from 'objection';
import { ResponseStatus } from 'utils/ResponseStatus';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(@Inject('UserModel') private User: ModelClass<UserModel>) {}

  async register(createAuthDto: CreateUserDto): Promise<ResponseStatus> {
    try {
      // check if the user already exists
      const user = await this.User.query().findOne({
        email: createAuthDto.email,
      });
      if (user) {
        throw new BadRequestException('User already exists');
      }
      const hash = await argon.hash(createAuthDto.password);

      // if not, create the user
      await this.User.query().insert({
        password: hash,
        email: createAuthDto.email,
        firstname: createAuthDto.firstName,
        lastname: createAuthDto.lastName,
      });

      return {
        status: HttpStatus.CREATED,
        message: 'Registration successful',
        data: user,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
