import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { BaseService } from 'src/modules/shared/base.service';
import { CommonListResponse, CommonResponse } from 'src/types/common.type';
import { UserResponse } from 'src/types/user.dto';
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
  }

  async getListUsers(
    req: Request,
  ): Promise<CommonResponse<CommonListResponse<UserResponse>>> {
    const params = this.convertParamsToObjectCondition<User>(
      req,
      new User(),
      ID_FIELD_USER,
    );
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
}
