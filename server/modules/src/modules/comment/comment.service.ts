import {Injectable, Inject, CACHE_MANAGER, BadRequestException} from '@nestjs/common';
import {Cache} from 'cache-manager';
import Mint from 'mint-filter';
import * as fs from 'fs';
import {MESSAGES} from 'src/core/enums/message.enum';
import {plainToClass} from 'class-transformer';
import {LocationService} from 'src/modules/location/location.service';
import {paging, toInteger} from 'src/core/lib';

import {GeetestService} from 'src/modules/geetest/geetest.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const Geetest = require('geetest');

// typeorm
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {OptionsEntity} from 'src/entity/options.entity';
import {CommentEntity} from 'src/entity/comment.entity';
import {ArticleEntity} from 'src/entity/article.entity';
import {FileEntity} from 'src/entity/file.entity';

@Injectable()
export class CommentService {
  private mint: any;
  private statusList: Array<string> = ['comment_record_ip', 'comment_status'];
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManger: Cache,
    @InjectRepository(CommentEntity) private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(OptionsEntity) private readonly optionsRepository: Repository<OptionsEntity>,
    @InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(FileEntity) private readonly fileRepository: Repository<FileEntity>,
    private readonly locationService: LocationService,
    private readonly geetestService: GeetestService
  ) {
    this.initKeywords('uploads/keywords');
  }

  /**
   * options table update
   * */
  private async options_update (key: string, value: any) {
    return await this.optionsRepository.update({key}, {key, value: JSON.stringify(value) });
  }

  private dig_params (arr, key) {
    return arr.reduce((acc, val) => {
      let str = null;
      try {
        str = JSON.parse(val.value)
      } catch(e) {
        str = val.value;
      }
      (val.key === key) ? acc = str : undefined;
      return acc;
    }, undefined);
  }

  /**
   * @desc 初始化敏感词加载filter
   * private
   * */
  private async initKeywords (keywords_path): Promise<any> {
    const files = await fs.promises.readdir(keywords_path);
    const key = [];
    for (const file of files) {
      const keywords = await this.readKeywords(`${keywords_path}/${file}`);
      key.push(...keywords);
    }
    const value = Array.from(new Set([...key]));
    this.mint = new Mint(value);
  }

  /**
   * @desc 读取对应目录下敏感词文件
   * private
   * */
  private readKeywords (path): Promise<any> {
    let str = '';
    // 创建可读流
    const readerStream = fs.createReadStream(path);
    // 设置编码为 utf8。
    readerStream.setEncoding('utf8');

    // 处理流事件
    const onData = new Promise(function (resolve, reject) {
      readerStream.on('data', function(chunk: any) {
        str += chunk;
      });
      readerStream.on('end',function () {
        const val = str.split(/[\r\n\,]+/).filter(v => Boolean(v));
        resolve(val);
      });
      readerStream.on('error', function (error) {
        reject(error);
      })
    });
    return onData;
  }

  /**
   * @desc 评论列表
   * @param query {object} page, pageSize
   * @return comment List
   * */
  public async commentLists (query) {
    const { page, pageSize } = paging(query.page, query.pageSize);
    const commentHandle = await this.commentRepository.createQueryBuilder('comment')
      .select(['comment', 'article.title', 'article.id'])
      .leftJoin('comment.article', 'article', 'article.id = comment.article_id')
      .orderBy({'comment.createdAt': 'DESC', 'comment.id': 'DESC'})
      .offset(page).limit(pageSize);

    // 如果id不存在则查所有，否则查询指定数据
    query.id && await commentHandle.where('comment.article_id = :id', {id: query.id});

    const [data, count] = await commentHandle.getManyAndCount();

    return {list: data, count};
  }

  /**
   * @desc 评论列表展示文章
   * @desc 相关联展示文章下存在评论数
   * */
  public async articleRelationsComment () {
    return await this.articleRepository.createQueryBuilder('article')
      .select(['article.id AS id', 'article.title AS title', 'article.createdAt AS createdAt', 'COUNT(comment.article_id) count'])
      .leftJoin('article.comments', 'comment')
      .groupBy('article.id')
      .orderBy({ 'article.updatedAt': 'DESC', 'article.id': 'DESC' })
      .getRawMany();
  }

  /**
   * @desc 文章关联评论列表
   * @desc 前端展示数据
   * @return 评论列表
   * */
  public async commentRelevanceList (query) {
    const [data, count] = await this.commentRepository.createQueryBuilder('comment')
      .select(['comment.id', 'comment.username', 'comment.content', 'comment.sensitive', 'comment.pass', 'comment.createdAt'])
      .where('comment.article_id = :article_id', {article_id: query.article_id})
      .andWhere('comment.status = :status', {status: 1})
      .orderBy({ 'comment.createdAt': 'DESC', 'comment.id': 'DESC' })
      .getManyAndCount();
    return {list: data, count};
  }

  /**
   * @desc 创建评论
   * @param data {Object} email, content article_id
   * @return create result
   * */
  public async createComment (data) {
    const { email, content, article_id, username, captcha } = data;
    const value = await this.optionsRepository.createQueryBuilder('options')
      .select(['options.key', 'options.value'])
      .where('options.key IN (:...keys)', { keys: ['webservice_key', 'comment_status', 'comment_record_ip' ] })
      .getMany();
    const comment_status = this.dig_params(value, 'comment_status');
    const webservice_key = this.dig_params(value, 'webservice_key');
    const comment_record_ip = this.dig_params(value, 'comment_record_ip');
    const params = plainToClass(CommentEntity, {email, content, username, article: { id: article_id } });
    if (!comment_status) {
      // 评论功能关闭
      throw new BadRequestException(MESSAGES.COMMENT_CLOSE);
    }

    // 校验极验
    const { success } = await this.geetestService.getCaptchaOptions();
    const everyValidate = Object.keys(captcha).every(v => v !== '');
    // 极验已经正常配置
    if (success) {
      // 校验是否前端传递过来的值为空
      if (!everyValidate) {
        throw new BadRequestException('极验校验不能为空');
      }
      // 配置校验是否通过,将从body中获取captcha来进行校验
      const validateStatus = await this.geetestService.validateCaptcha({ ...captcha });
      if (!validateStatus) {
        throw new BadRequestException('极验校验失败，无法创建评论');
      }
    }

    if (comment_record_ip) {
      if (!webservice_key) {
        // 开启评论记录IP，且暂未配置webservice ip
        throw new BadRequestException(MESSAGES.WEBSERVICE_KEY_EMPTY);
      }
      // 获取IP地址,IP解析实际地址
      const {query_ip_location: { result: {ip} }, detail_location: { result: { address } } } = await this.locationService.getLocation();
      Object.assign(params, {ip, address});
    }
    // 过滤空格，转换小写
    const text = content.toLowerCase().replace(/\s*/g, '');
    const filterWords = await this.mint.filter(text);
    // 合并其他参数值
    Object.assign(params, {
      content: filterWords.text,
      sensitive: JSON.stringify(filterWords.words),
      original: content,
      pass: Number(filterWords.pass)
    });
    // 插入数据
    const { raw: { affectedRows } } = await this.commentRepository.createQueryBuilder('comment')
      .insert()
      .into(CommentEntity)
      .values(params)
      .execute();
    return {message: `成功创建${affectedRows}条`};
  }

  /**
   * @desc 删除评论
   * */
  public async deleteComment (data) {
    const coverValue = Array.isArray(data.id) ? data.id : Array.of(data.id);
    const {raw: { affectedRows } } = await this.commentRepository.createQueryBuilder('comment')
      .delete()
      .where('comment.id IN (:...id)', {id: coverValue})
      .execute();
    return {message: `成功删除${affectedRows}条`};
  }

  /**
   * ===================评论配置=========================
   * */
  /**
   * @desc 获取评论开启状态
   * @desc not auth
   * */
  public async getCommentSwitchStatus (keys: Array<string>) {
    return await this.getCommentStatus(keys);
  }

  /**
   * @desc 获取评论开启状态及记录IP状态
   * */
  public async getCommentStatus (keys : Array<string>) {
    const commentStatusLists = await this.optionsRepository.createQueryBuilder('options')
      .select(['options.key', 'options.value'])
      .where(`options.key IN (:...key)`, {key: keys})
      .getMany();
    return commentStatusLists.reduce((acc,val) => (void(acc[val.key] = val.value) || acc), {});
  }

  /**
   * @desc 开启关闭评论
   * @desc 开启关闭评论记录IP功能
   * @param data {Object} status
   * */
  public async changeCommentStatus (data) {
    const { status, field } = data;
    console.log(this.statusList, 'abc');
    if (this.statusList.includes(field)) {
      await this.options_update(field, toInteger(status));
      return {message: '更新成功'};
    }
    throw new BadRequestException('参数值错误');
  }

  /**
   * @desc 上传敏感词文件
   * */
  public async uploadKeywordsFile (file) {
    const {originalname, filename, size, path} = file;
    const value = {original_name: originalname, file_type: 'keywords', filename, size, path };
    const data = await this.fileRepository.save(value);
    // 重载敏感词
    await this.initKeywords('uploads/keywords');
    return {name: data.original_name, id: data.id};
  }

  /**
   * @desc 敏感词文件列表
   * */
  public async uploadKeyWordsLists () {
    const data = await this.fileRepository.createQueryBuilder('keywords')
      .select(['keywords.id', 'keywords.original_name'])
      .where("file_type = 'keywords'")
      .getMany();
    return { list: data };
  }

  /**
   * @desc 删除敏感词文件
   * */
  public async uploadKeyWordsDelete ({ id }) {
    const data = await this.fileRepository.findOne({id});
    if (!data) {
      // 数据库数据不存在抛出error
      throw new BadRequestException(MESSAGES.DATA_NOT_EXISTS_ERROR);
    }
    if (!fs.existsSync(data.path)) {
      // 文件不存在
      throw new BadRequestException(MESSAGES.FILE_NOT_EXISTS_ERROR);
    }

    const {raw: { affectedRows } } = await this.fileRepository.createQueryBuilder()
      .delete()
      .where('id = :id', {id})
      .execute();

    if (affectedRows) {
      // 成功在数据库中删除数据同时删除文件
      await fs.unlinkSync(data.path);
      // 重载敏感词
      await this.initKeywords('uploads/keywords');
    }

    return {message: `成功删除${affectedRows}条`};

  }

  /**
   * @desc 检测识别文本敏感词
   * */
  public async detectionSensitiveWords ({ text }) {
    // 过滤空格，转换小写
    const word = text.toLowerCase().replace(/\s*/g, '');
    const { words, pass } = await this.mint.filter(word);
    return { words, pass };
  }

  /**
   * ===================极验配置=========================
   * */

}
