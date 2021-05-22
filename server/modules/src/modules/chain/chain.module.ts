import {Module} from '@nestjs/common';
import {ChainController} from './chain.controller';
import { ChainService } from './chain.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ChainEntity } from 'src/entity/chain.entity';
import { OptionsEntity } from 'src/entity/options.entity';

import {EmailModule} from 'src/modules/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ ChainEntity, OptionsEntity ]),
    EmailModule
  ],
  controllers: [ ChainController ],
  providers: [ ChainService ]
})
export class ChainModule {}
