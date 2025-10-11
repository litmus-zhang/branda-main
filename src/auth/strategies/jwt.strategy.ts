import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ModelClass } from 'objection';
import { UserModel } from 'src/database/entities';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('UserModel') private User: ModelClass<UserModel>,
    private config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('ACCESS_JWT_SECRET'),
      passReqToCallback: true, // Enable request object in validate method
    });
  }
  async validate(req: Request, payload: { sub: number; email: string }) {
    const user = await this.User.query().findById(payload.sub);
    if (!user) return null;
    delete user.password;
    return user;
  }
}
