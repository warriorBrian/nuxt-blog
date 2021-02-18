import {Module} from '@nestjs/common';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';

import {TypeOrmModule} from '@nestjs/typeorm';
import {UsersEntity} from 'src/entity/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity])
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
