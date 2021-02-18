import {Module, HttpModule} from '@nestjs/common';
import {LocationController} from './location.controller';
import {LocationService} from './location.service';

import {TypeOrmModule} from '@nestjs/typeorm';
import {OptionsEntity} from 'src/entity/options.entity';

import {RateLimiterModule} from 'nestjs-rate-limiter';

@Module({
  imports: [
    RateLimiterModule,
    HttpModule,
    TypeOrmModule.forFeature([OptionsEntity])
  ],
  controllers: [LocationController],
  providers: [LocationService]
})
export class LocationModule {}
