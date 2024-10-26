import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { ResponseStatus } from 'utils/ResponseStatus';
import { WorkspaceModel } from 'src/database/entities';
import { ModelClass } from 'objection';
@Injectable()
export class WorkspaceService {
  constructor(
    @Inject('WorkspaceModel') private Workspace: ModelClass<WorkspaceModel>,
  ) {}
  async create(
    userID: number,
    createWorkspaceDto: CreateWorkspaceDto,
  ): Promise<ResponseStatus> {
    // check if workspace already exists in the list of workspaces created by the user
    // if it exists, return an error message
    // if it does not exist, create the workspace
    try {
      const workspace = await this.Workspace.query().findOne({
        name: createWorkspaceDto.name,
        createdBy: userID,
      });
      if (workspace) {
        return {
          status: HttpStatus.CONFLICT,
          message: 'Workspace already exists for this user',
        };
      }
      await this.Workspace.query().insert({
        createdBy: userID,
        name: createWorkspaceDto.name,
        description: createWorkspaceDto.description,
      });

      return {
        status: HttpStatus.CREATED,
        message: 'Workspace created successfully',
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async findAll(userId, limit: number, page: number): Promise<ResponseStatus> {
    const userworkspaces = await this.Workspace.query()
      .where('createdBy', userId)
      .page(page, limit)
      .orderBy('updated_at', 'desc');
    userworkspaces['limit'] = limit;
    userworkspaces['page'] = page;

    // const result = await paginate(userworkspaces, page, limit);
    return {
      message: 'Workspaces fetched successfully',
      data: userworkspaces,
    };
  }
  findOne(id: number) {
    return `This action returns a #${id} workspace`;
  }

  update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    console.log({ updateWorkspaceDto });
    return `This action updates a #${id} workspace`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }
}
