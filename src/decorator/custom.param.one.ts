import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PREFIX_TOKEN } from 'src/constants/default.value';
import { InvalidParam } from '../exception';
import { UnauthorizeException } from '../exception/unauthorize.exception';

export const AuthParamOne = createParamDecorator(
  async (data: string, ctx: ExecutionContext, isAuth?: boolean) => {
    const request = ctx.switchToHttp().getRequest();
    if (!isAuth) {
      if (!request.query[data]) {
        throw new InvalidParam(`invalid param ${data}`);
      }
      return request.query[data];
    }
    const token = request.headers.token;
    if (!token) {
      throw new UnauthorizeException('unauthorized');
    }
    try {
      const prefix = token.slice(0, 7);
      if (prefix !== PREFIX_TOKEN) {
        throw new UnauthorizeException('unauthorized');
      }
      const endpoint = request.route.path.slice(5, request.route.path.length);
      // await validateUserPermission(token, endpoint);
      if (!request.query[data]) {
        throw new InvalidParam(`invalid param ${data}`);
      }
      return request.query[data];
    } catch (error: any) {
      throw new UnauthorizeException(error.message);
    }
  },
);
