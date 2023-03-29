import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    // fetching the user property from the request
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
