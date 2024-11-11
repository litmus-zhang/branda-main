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

  async findAll(
    userId,
    limit: number = 10,
    page: number = 1,
  ): Promise<ResponseStatus> {
    const userworkspaces = await this.Workspace.query()
      .where('createdBy', userId)
      .limit(limit)
      .page(page - 1, limit)
      .offset((page - 1) * limit)
      .orderBy('created_at', 'desc');

    userworkspaces['size'] = limit;
    userworkspaces['page'] = page;
    // const result = await paginate(userworkspaces, page, limit);
    return {
      message: 'Workspaces fetched successfully',
      data: userworkspaces,
    };
  }
  async findOne(userId, id: number): Promise<ResponseStatus> {
    try {
      const workspace = await this.Workspace.query().findOne({
        id,
        createdBy: userId,
      });
      if (!workspace) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Workspace not found',
        };
      }
      return {
        status: HttpStatus.OK,
        message: 'Workspace fetched successfully',
        data: workspace,
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async update(
    userId,
    id: number,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ): Promise<ResponseStatus> {
    try {
      const workspace = await this.Workspace.query().findById(id).where({
        createdBy: userId,
      });
      if (!workspace) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Workspace not found',
        };
      }
      const updatedWorkspace = await this.Workspace.query().updateAndFetchById(
        id,
        {
          name: updateWorkspaceDto.name,
          description: updateWorkspaceDto.description,
        },
      );
      return {
        status: HttpStatus.OK,
        message: 'Workspace updated successfully',
        data: updatedWorkspace,
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async remove(userId, id: number): Promise<ResponseStatus> {
    try {
      await this.Workspace.query().deleteById(id).where({
        createdBy: userId,
      });
      return {
        status: HttpStatus.OK,
        message: 'Workspace deleted successfully',
      };
    } catch (error) {
      return {
        message: error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
