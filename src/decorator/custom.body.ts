import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PREFIX_TOKEN } from 'src/constants/default.value';
import { UnauthorizeException } from '../exception/unauthorize.exception';

export const AuthBody = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
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
      return request.body;
    } catch (error: any) {
      throw new UnauthorizeException(error.message);
    }
  },
);
