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
import { CommonListResponse, CommonResponse } from 'src/types/common.type';
import { UserRequest, UserResponse } from 'src/types/user.dto';
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

  @Get(EndpointTree.USER.USER_DETAIL)
  async getDetailUser(
    @AuthParamOne('id') id: string,
  ): Promise<CommonResponse<UserResponse>> {
    return await this.service.getUserDetail(id);
  }

  @Post(EndpointTree.USER.USER_INSERT)
  async insertNewUser(
    @AuthBody() req: UserRequest,
  ): Promise<CommonResponse<null>> {
    return await this.service.createUser(req);
  }

  @Put(EndpointTree.USER.USER_ACTIVE)
  async activeUser(
    @AuthParamOne('id') id: string,
  ): Promise<CommonResponse<null>> {
    return await this.service.changeActiveUser(id, true);
  }

  @Put(EndpointTree.USER.DEACTIVATE_USER)
  async deactivateUser(
    @AuthParamOne('id') id: string,
  ): Promise<CommonResponse<null>> {
    return await this.service.changeActiveUser(id, false);
  }

  @Delete(EndpointTree.USER.DELETE_USER)
  async deleteUser(
    @AuthParamOne('id') id: string,
  ): Promise<CommonResponse<null>> {
    return await this.service.deleteUserId(id);
  }
}
