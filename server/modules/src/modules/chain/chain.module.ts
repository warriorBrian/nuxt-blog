import {Module} from '@nestjs/common';
import {ChainController} from './chain.controller';
import { ChainService } from './chain.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ChainEntity } from 'src/entity/chain.entity';

import {EmailModule} from 'src/modules/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ ChainEntity ]),
    EmailModule
  ],
  controllers: [ ChainController ],
  providers: [ ChainService ]
})
export class ChainModule {}
