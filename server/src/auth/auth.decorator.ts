import {SetMetadata, applyDecorators, UseGuards} from '@nestjs/common';
import {AuthStrategyGuard} from './auth.strategy.guard';

export const AuthStrategy = (include = true) => {
  // 应用装饰器，设置反射值以后再调用鉴权守卫
  return applyDecorators(
    SetMetadata('roles', include),
    UseGuards(AuthStrategyGuard)
  );
};
