import {
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthBody } from 'src/decorator/custom.body';
import { AuthParamOne } from 'src/decorator/custom.param.one';
import { AuthRequest } from 'src/decorator/custom.request';
import { EndpointTree } from 'src/endpoints';
import { HttpExceptionFilter } from 'src/exception';
import { BaseController } from 'src/modules/shared/base.controller';
import {
  CommonListResponse,
  CommonResponse,
} from 'src/modules/shared/common.type';
import {
  PermissionRequest,
  PermissionResponse,
} from '../service/permission.dto';
import { PermissionService } from '../service/permission.service';

@UseFilters(new HttpExceptionFilter())
@Controller(EndpointTree.PERMISSION.PERMISSION_ROOT)
export class PermissionController extends BaseController<PermissionService> {
  constructor(
    @Inject(PermissionService)
    private permissionService: PermissionService,
  ) {
    super();
    this.service = this.permissionService;
  }

  @Get(EndpointTree.PERMISSION.GET_LIST_PERMISSION)
  async getDisableFeatureList(
    @AuthRequest() req: Request,
  ): Promise<CommonResponse<CommonListResponse<PermissionResponse>>> {
    return await this.service.getListPerms(req);
  }

  @Post(EndpointTree.PERMISSION.ADD_PERMISSION)
  async addPermission(
    @AuthBody() req: PermissionRequest,
  ): Promise<CommonResponse<null>> {
    return await this.service.createPerm(req);
  }

  @Put(EndpointTree.PERMISSION.UPDATE_PERMISSION)
  async updatePermission(
    @AuthBody() req: PermissionRequest,
    @AuthParamOne('id') permId: string,
  ): Promise<CommonResponse<null>> {
    return await this.service.updatePerm(req, permId);
  }

  @Put(EndpointTree.PERMISSION.ACTIVE_PERMISSION)
  async activePermission(
    @AuthParamOne('id') id: string,
  ): Promise<CommonResponse<null>> {
    return await this.service.changeActivePerm(id, true);
  }

  @Put(EndpointTree.PERMISSION.DEACTIVATE_PERMISSION)
  async deactivatePermission(
    @AuthParamOne('id') id: string,
  ): Promise<CommonResponse<null>> {
    return await this.service.changeActivePerm(id, false);
  }

  @Get(EndpointTree.PERMISSION.PERMISSION_DETAIL)
  async getDetailPermission(
    @AuthParamOne('id') id: string,
  ): Promise<CommonResponse<PermissionResponse>> {
    return this.service.getPermDetail(id);
  }

  @Delete(EndpointTree.PERMISSION.DELETE_PERMISSION)
  async deletePermission(
    @AuthParamOne('id') id: string,
  ): Promise<CommonResponse<PermissionResponse>> {
    return this.service.deletePermId(id);
  }
}
