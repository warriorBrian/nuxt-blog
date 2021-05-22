import {Module} from '@nestjs/common';

// passport jwt
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import { constants } from './constants';

// service
import {AuthService} from './auth.service';
import {JwtStrategy} from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: constants.secret,
      signOptions: {expiresIn: '1d'}
    })
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
