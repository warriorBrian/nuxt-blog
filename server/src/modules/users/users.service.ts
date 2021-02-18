import {Injectable, BadRequestException} from '@nestjs/common';

// orm
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UsersEntity} from 'src/entity/users.entity';

// common
import {plainToClass} from 'class-transformer';
import {encryptionRules, paging} from 'src/core/lib';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>
  ) {}

  /**
   * @desc 获取用户列表
   * */

  public async getUserList (body) {
    const {page, pageSize} = paging(body.page, body.pageSize);
    const [data, count] = await this.usersRepository.createQueryBuilder('users')
      .select(['users.id', 'users.username', 'users.createdAt', 'users.updatedAt'])
      .skip(page).take(pageSize).getManyAndCount();
    return {result: data, count};
  }

  /**
   * @desc 创建用户
   * */
  public async createUser ({username, password}) {
    if (!username || !password) {
      throw new BadRequestException('用户名或密码不能为空');
    }
    const findUsername = await this.usersRepository.findOne({username});
    if (findUsername) {
      throw new BadRequestException('用户名已存在');
    }
    /**
     * 使用 plainToClass 进行合并实例化 users 实例
     * 这么做将会触发@BeforeInsert, @BeforeUpdate
     * typeorm bug，直接使用save将不会直接触发BeforeInsert等钩子函数
     * */
    const value = plainToClass(UsersEntity, {username, password: encryptionRules(password)});
    await this.usersRepository.save(value);
    return {message: '创建用户成功'};
  }

  /**
   * @desc 删除用户
   * */
  public async deleteUser (id) {
    const {affected} = await this.usersRepository.delete(id);
    return {message: `删除 ${affected} 条数据`};
  }

  /**
   * @desc 修改密码
   * */
  public async changePwd ({id, old_password, new_password}) {
    if (old_password === new_password) {
      throw new BadRequestException('新密码不能与旧密码一致');
    }
    if (id === undefined) {
      throw new BadRequestException("id不能为空");
    }
    const findUser = await this.usersRepository.findOne({id});
    if (!findUser) {
      throw new BadRequestException("没有查询到此用户");
    }
    if (encryptionRules(old_password) === findUser.password) {
      // 密码相等，且通过以上校验
      const value = plainToClass(UsersEntity, {id, password: encryptionRules(new_password)});
      await this.usersRepository.save(value);
      return {message: "密码修改成功，请重新登录"};
    } else {
      throw new BadRequestException("原密码输入错误");
    }

  }

}
