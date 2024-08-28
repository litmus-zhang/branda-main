import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto, LoginDto } from './dto';
import { UserModel } from 'src/database/entities';
import { ModelClass } from 'objection';
import { ResponseStatus } from 'utils/ResponseStatus';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserModel') private User: ModelClass<UserModel>,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

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
  async login(loginDto: LoginDto) {
    try {
      // check if the user exists
      const user = await this.User.query().findOne({
        email: loginDto.email,
      });
      if (!user) {
        throw new BadRequestException('Invalid email or password');
      }
      // check if the password is correct
      const isPasswordValid = await argon.verify(
        user.password,
        loginDto.password,
      );
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid email or password');
      }
      // create access and refresh tokens
      const tokens = await this.signToken(user.id, user.email);
      return {
        message: 'Login successful',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { sub: userId, email };
    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '30m',
      secret: this.config.get('ACCESS_JWT_SECRET'),
    });
    const refresh_token = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: this.config.get('REFRESH_JWT_SECRET'),
    });
    return {
      access_token,
      refresh_token,
    };
  }
  async refreshToken(token: { refresh_token: string }) {
    try {
      const { refresh_token } = token;
      const payload = await this.jwt.verifyAsync(String(refresh_token), {
        secret: this.config.get('REFRESH_JWT_SECRET'),
      });
      const newToken = await this.signToken(payload.sub, payload.email);
      return {
        message: 'Token refreshed successfully',
        access_token: newToken.access_token,
        refresh_token: newToken.refresh_token,
      };
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  }
}
