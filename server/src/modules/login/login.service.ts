import {Injectable, BadRequestException} from '@nestjs/common';

// TypeORM
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UsersEntity} from 'src/entity/users.entity';
import {OptionsEntity} from 'src/entity/options.entity';

// common
import {omit, encryptionRules} from 'src/core/lib';
import {MESSAGES} from 'src/core/enums/message.enum';
import {AuthService} from 'src/auth/auth.service';
import {GoogleAuthService} from 'src/modules/googleAuth/googleAuth.service';


@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(UsersEntity) private readonly userRepository: Repository<UsersEntity>,
    private readonly authService: AuthService,
    @InjectRepository(OptionsEntity) private readonly optionsEntity: Repository<OptionsEntity>,
    private readonly googleAuthService: GoogleAuthService
  ) {}
  async store (body) {
    const {username, password} = body;
    const user = await this.userRepository.findOne({username});
    // 获取谷歌验证开关状态
    const { value } = await this.optionsEntity.findOne({key: 'auth_status'});
    const auth_status = Boolean(JSON.parse(value));
    const pwd = encryptionRules(password);
    if (!user || user.password !== pwd) {
      throw new BadRequestException(MESSAGES.USER_OR_PWD_ERROR);
    }
    // 谷歌验证器开启，校验code是否合法
    if (auth_status) {
      const { result: googleAuthResult } = await this.googleAuthService.validateCode(body.code);
      if (!googleAuthResult) {
        throw new BadRequestException(MESSAGES.GOOGLE_AUTH_ERROR);
      }
    }
    const token = await this.authService.sign({user, pwd});
    return omit({...user, token}, ['password']);
  }
}
