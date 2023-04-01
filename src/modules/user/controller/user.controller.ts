import { Controller, Get, Inject, UseFilters } from '@nestjs/common';
import { Request } from 'express';
import { AuthRequest } from 'src/decorator/custom.request';
import { EndpointTree } from 'src/endpoints';
import { HttpExceptionFilter } from 'src/exception';
import { BaseController } from 'src/modules/shared/base.controller';
import { CommonListResponse, CommonResponse } from 'src/types/common.type';
import { UserResponse } from 'src/types/user.dto';
import { UserService } from '../service/user.service';

@UseFilters(new HttpExceptionFilter())
@Controller(EndpointTree.USER.USER_ROOT)
export class UserController extends BaseController<UserService> {
  constructor(
    @Inject(UserService)
    private userService: UserService,
  ) {
    super();
    this.service = this.userService;
  }

  @Get(EndpointTree.USER.USER_GET_LIST)
  async getAllUser(
    @AuthRequest() req: Request,
  ): Promise<CommonResponse<CommonListResponse<UserResponse>>> {
    return await this.service.getListUsers(req);
  }

  // @Post(EndpointTree.USER.USER_INSERT)
  // async insertNewUser(
  //   @AuthBody() req: UserRequest,
  // ): Promise<CommonResponse<null>> {
  //   return await this.service.insertAndUpdateUser(req);
  // }

  // @Put(EndpointTree.USER.USER_UPDATE)
  // async updateUser(
  //   @AuthBody() req: UserRequest,
  //   @AuthParamOne('id') id: string,
  // ): Promise<CommonResponse<null>> {
  //   return await this.service.insertAndUpdateUser(req, id);
  // }

  // @Put(EndpointTree.USER.USER_ACTIVE)
  // async activeUser(
  //   @AuthParamOne('id') id: string,
  // ): Promise<CommonResponse<null>> {
  //   return await this.service.changeActive(id, true);
  // }

  // @Put(EndpointTree.USER.DEACTIVATE_USER)
  // async deactivateUser(
  //   @AuthParamOne('id') id: string,
  // ): Promise<CommonResponse<null>> {
  //   return await this.service.changeActive(id, false);
  // }
}
