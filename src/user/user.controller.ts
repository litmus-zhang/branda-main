import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guards';
import { UserModel } from '../database/entities';
import { GetUser } from '../auth/decorators';
import { ResponseStatus } from '../../utils/ResponseStatus';
import { CreateUserDto } from '../auth/dto';

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
  @Patch('update-profile')
  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  async updateProfile(
    @GetUser('id') id: number,
    @Body() dto: CreateUserDto,
  ): Promise<ResponseStatus> {
    return this.userService.updateProfile(id, dto);
  }
}
