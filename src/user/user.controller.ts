import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guards';
import { UserModel } from '../database/entities';
import { GetUser } from '../auth/decorators';
import { ResponseStatus } from '../../utils/ResponseStatus';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getMe(@GetUser() user: UserModel): Promise<ResponseStatus> {
    return {
      message: 'User profile fetched successfully',
      data: user,
      status: 200,
    };
  }
}
