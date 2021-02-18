import {Module} from '@nestjs/common';
import {GoogleAuthController} from './googleAuth.controller';
import {GoogleAuthService} from './googleAuth.service';

import {TypeOrmModule} from '@nestjs/typeorm';
import {GoogleAuthEntity} from 'src/entity/googleAuth.entity';
import {OptionsEntity} from 'src/entity/options.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GoogleAuthEntity, OptionsEntity])
  ],
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService],
  exports: [GoogleAuthService]
})
export class GoogleAuthModule {}
