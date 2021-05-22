import {Module} from '@nestjs/common';
import {GeetestController} from './geetest.controller';
import {GeetestService} from './geetest.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {OptionsEntity} from 'src/entity/options.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OptionsEntity])
  ],
  controllers: [GeetestController],
  providers: [GeetestService],
  exports: [GeetestService]
})
export class GeetestModule {}
