import {Injectable, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {Reflector} from '@nestjs/core';

@Injectable()
export class AuthStrategyGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const includes = (roles == null) ? true : roles;
    return includes ? super.canActivate(context) : true;
  }
  handleRequest (err, user, info) {
    if (info) {
      throw new UnauthorizedException(info.message);
    }
    return user;
  }
}
