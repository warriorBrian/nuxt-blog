import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { BlacklistController } from './blacklist.controller';
import { BlacklistService } from './blacklist.service';
import { AuthModule } from 'src/auth/auth.module';
import { LocationModule } from 'src/modules/location/location.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlacklistEntity } from 'src/entity/blacklist.entity';
import {OptionsEntity} from 'src/entity/options.entity';

import { BlacklistMiddleware } from 'src/middleware/blacklist.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlacklistEntity, OptionsEntity]),
    AuthModule,
    LocationModule
  ],
  controllers: [BlacklistController],
  providers: [BlacklistService],
  exports: [BlacklistService]
})
export class BlacklistModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(BlacklistMiddleware).forRoutes(
      { path: 'blacklist/test', method: RequestMethod.GET }
    );
  }
}
