import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { InvalidRequest, NotfoundException } from 'src/exception';
import { BaseService } from 'src/modules/shared/base.service';
import {
  CommonListResponse,
  CommonResponse,
} from 'src/modules/shared/common.type';
import { Permission } from '../repository/permission.entity';
import {
  ID_FIELD_PERMISSION,
  PermissionRepository,
} from '../repository/permission.repository';
import { PermissionRequest, PermissionResponse } from './permission.dto';

@Injectable()
export class PermissionService extends BaseService<PermissionRepository> {
  constructor(
    @Inject(PermissionRepository)
    private permRepo: PermissionRepository,
  ) {
    super();
    this.repository = this.permRepo;
    this.idField = ID_FIELD_PERMISSION;
  }

  async getListPerms(
    req: Request,
  ): Promise<CommonResponse<CommonListResponse<PermissionResponse>>> {
    const params = this.convertParamsToObjectCondition<Permission>(
      req,
      new Permission(),
    );
    const result = await this.repository.findAll(params);
    const { list, total } = result;
    return this.renderSuccessResponse<CommonListResponse<PermissionResponse>>({
      data: {
        ...this.getPagePageSize(req),
        list: list.map((item) =>
          this.objectMapper<Permission, PermissionResponse>(
            item,
            new PermissionResponse(),
          ),
        ),
        total,
      },
    });
  }

  async getPermDetail(id: string): Promise<CommonResponse<PermissionResponse>> {
    const findPerm = await this.repository.findOne({
      where: {
        [this.idField]: id,
      },
    });
    if (!findPerm) throw new NotfoundException('not found');
    return this.renderSuccessResponse<PermissionResponse>({
      data: this.objectMapper<Permission, PermissionResponse>(
        findPerm,
        new PermissionResponse(),
      ),
    });
  }

  async createPerm(perm: PermissionRequest): Promise<CommonResponse<null>> {
    await this.validateRequest(PermissionRequest, perm);
    const findPermName = await this.repository.findOne({
      where: {
        permissionName: perm.permissionName,
      },
    });
    if (findPermName) {
      throw new InvalidRequest('invalid request', {
        permissionName: 'permission name existed',
      });
    }
    const entity = this.objectMapper<PermissionRequest, Permission>(
      perm,
      new Permission(),
    );
    await this.repository.insertOrUpdate([entity]);
    return this.renderSuccessResponse<null>({
      message: 'add success',
    });
  }

  async updatePerm(
    perm: PermissionRequest,
    id: string,
  ): Promise<CommonResponse<null>> {
    await this.validateRequest(PermissionRequest, perm);
    const findPerm = await this.repository.findOne({
      where: {
        [this.idField]: id,
      },
    });
    if (!findPerm) throw new NotfoundException('not found');
    const findPermName = await this.repository.findOne({
      where: {
        permissionName: perm.permissionName,
      },
    });
    if (findPermName) {
      throw new InvalidRequest('invalid request', {
        permissionName: 'permission name existed',
      });
    }
    await this.repository.insertOrUpdate([
      { ...findPerm, permissionName: perm.permissionName },
    ]);
    return this.renderSuccessResponse<null>({
      message: 'update success',
    });
  }

  async changeActivePerm(
    id: string,
    isActive: boolean,
  ): Promise<CommonResponse<null>> {
    const findPerm = await this.repository.findOne({
      where: {
        [this.idField]: id,
      },
    });
    if (!findPerm) throw new NotfoundException('not found');
    const entity: Permission = { ...findPerm, active: isActive ? 1 : 0 };
    await this.repository.insertOrUpdate([entity]);
    return this.renderSuccessResponse<null>({
      message: isActive ? 'enable success' : 'disable success',
    });
  }

  async deletePermId(id: string): Promise<CommonResponse<null>> {
    const findPerm = await this.repository.findOne({
      where: {
        [this.idField]: id,
      },
    });
    if (!findPerm) throw new NotfoundException('not found');
    await this.repository.delete([findPerm]);
    return this.renderSuccessResponse<null>({
      message: 'delete success',
    });
  }
}
