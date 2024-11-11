import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { JwtGuard } from '../auth/guards';
import { GetUser } from '../auth/decorators';

@Controller('workspace')
@UseGuards(JwtGuard)
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post('create')
  create(
    @GetUser('id') id: number,
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ) {
    return this.workspaceService.create(id, createWorkspaceDto);
  }

  @Get('all')
  findAll(
    @GetUser('id') id: number,
    @Query('limit') limit: string = '10',
    @Query('page') page: string = '0',
  ) {
    return this.workspaceService.findAll(id, parseInt(limit), parseInt(page));
  }

  @Get(':id')
  findOne(@GetUser('id') userId: number, @Param('id') id: string) {
    return this.workspaceService.findOne(userId, +id);
  }

  @Patch(':id')
  update(
    @GetUser('id') userId: number,
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.update(userId, +id, updateWorkspaceDto);
  }

  @Delete(':id')
  remove(@GetUser('id') userId: number, @Param('id') id: string) {
    return this.workspaceService.remove(userId, +id);
  }
}
