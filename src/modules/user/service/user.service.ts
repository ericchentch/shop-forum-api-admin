import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { env } from 'src/constants/environment';
import { InvalidRequest, NotfoundException } from 'src/exception';
import { hashPassword } from 'src/libs';
import { BaseService } from 'src/modules/shared/base.service';
import { CommonListResponse, CommonResponse } from 'src/types/common.type';
import { UserRequest, UserResponse } from 'src/types/user.dto';
import { User } from '../repository/user.entity';
import { ID_FIELD_USER, UserRepository } from '../repository/user.repository';

@Injectable()
export class UserService extends BaseService<UserRepository> {
  constructor(
    @Inject(UserRepository)
    private userRepository: UserRepository,
  ) {
    super();
    this.repository = this.userRepository;
    this.idField = ID_FIELD_USER;
  }

  async getListUsers(
    req: Request,
  ): Promise<CommonResponse<CommonListResponse<UserResponse>>> {
    const params = this.convertParamsToObjectCondition<User>(req, new User());
    const result = await this.repository.findAll(params);
    const { list, total } = result;
    return this.renderSuccessResponse<CommonListResponse<UserResponse>>({
      data: {
        ...this.getPagePageSize(req),
        list: list.map((item) =>
          this.objectMapper<User, UserResponse>(item, new UserResponse()),
        ),
        total,
      },
    });
  }

  async getUserDetail(id: string): Promise<CommonResponse<UserResponse>> {
    const findUser = await this.repository.findOne({
      where: {
        [this.idField]: id,
      },
    });
    if (!findUser) throw new NotfoundException('not found');
    return this.renderSuccessResponse<UserResponse>({
      data: this.objectMapper<User, UserResponse>(findUser, new UserResponse()),
    });
  }

  async createUser(user: UserRequest): Promise<CommonResponse<null>> {
    await this.validateRequest(UserRequest, user);
    const findUsername = await this.repository.findOne({
      where: {
        username: user.username,
      },
    });
    if (findUsername) {
      throw new InvalidRequest('invalid request', {
        username: 'username existed',
      });
    }
    const findPhone = await this.repository.findOne({
      where: {
        phone: user.phone,
      },
    });
    if (findPhone) {
      throw new InvalidRequest('invalid request', {
        phone: 'phone existed',
      });
    }
    const findEmail = await this.repository.findOne({
      where: {
        email: user.email,
      },
    });
    if (findEmail) {
      throw new InvalidRequest('invalid request', {
        email: 'email existed',
      });
    }
    const entity = this.objectMapper<UserRequest, User>(user, new User());
    const { DEFAULT_PASSWORD } = env();
    const password = await hashPassword(DEFAULT_PASSWORD);
    await this.repository.insertOrUpdate([{ ...entity, password }]);
    return this.renderSuccessResponse<null>({
      message: 'add success',
    });
  }

  async changeActiveUser(
    id: string,
    isActive: boolean,
  ): Promise<CommonResponse<null>> {
    const findUser = await this.repository.findOne({
      where: {
        [this.idField]: id,
      },
    });
    if (!findUser) throw new NotfoundException('not found');
    const entity: User = { ...findUser, active: isActive ? 1 : 0 };
    await this.repository.insertOrUpdate([entity]);
    return this.renderSuccessResponse<null>({
      message: isActive ? 'enable success' : 'disable success',
    });
  }

  async deleteUserId(id: string): Promise<CommonResponse<null>> {
    const findUser = await this.repository.findOne({
      where: {
        [this.idField]: id,
      },
    });
    if (!findUser) throw new NotfoundException('not found');
    await this.repository.delete([findUser]);
    return this.renderSuccessResponse<null>({
      message: 'delete success',
    });
  }
}
