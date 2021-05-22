import {Module} from '@nestjs/common';
import {LoginController} from './login.controller';
import {LoginService} from './login.service';
import {AuthModule} from 'src/auth/auth.module';
import {GoogleAuthModule} from 'src/modules/googleAuth/googleAuth.module';

import {TypeOrmModule} from '@nestjs/typeorm';
import {UsersEntity} from 'src/entity/users.entity';
import {OptionsEntity} from 'src/entity/options.entity';

@Module({
  imports: [
    AuthModule,
    GoogleAuthModule,
    TypeOrmModule.forFeature([UsersEntity, OptionsEntity])
  ],
  controllers: [LoginController],
  providers: [LoginService]
})
export class LoginModule {}
