import {Injectable, BadRequestException} from '@nestjs/common';

// typeorm
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, Connection} from 'typeorm';
import {ArticleEntity} from 'src/entity/article.entity';
import {UsersEntity} from 'src/entity/users.entity';
import {TagsEntity} from 'src/entity/tags.entity';
import {ArticleRelationsTagsEntity} from 'src/entity/articleRelationsTags.entity';
import {plainToClass} from 'class-transformer';
import {MESSAGES} from 'src/core/enums/message.enum';
import { paging } from 'src/core/lib';

// 图片上传服务
import {UploadService} from 'src/upload/upload.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(TagsEntity) private readonly tagsRepository: Repository<TagsEntity>,
    @InjectRepository(ArticleRelationsTagsEntity) private readonly articleRelationsRepository: Repository<ArticleRelationsTagsEntity>,
    private readonly uploadService: UploadService,
    private readonly connection: Connection
  ) {}

  public async getArticleList (query, user) {
    const {page, pageSize} = paging(query.page, query.pageSize);
    const data = await this.articleRepository.createQueryBuilder('article')
      .select(['article.id AS id','article.title AS title', 'article.introduction AS introduction', 'article.createdAt AS createdAt', 'article.updatedAt AS updatedAt', 'COUNT(comment.article_id) comment_count'])
      .where('article.user_id = :id', { id: user.id })
      .leftJoin('article.comments', 'comment')
      .groupBy('article.id')
      .orderBy({ 'article.updatedAt': 'DESC', 'article.id': 'DESC' })
      .offset(page).limit(pageSize)
      .getRawMany();
    const count = await this.articleRepository.count();
    return {lists: data, count};
    // const [data, count] = await this.articleRepository.createQueryBuilder('article')
    // .select(['article.id','article.title', 'article.introduction', 'article.createdAt', 'article.updatedAt'])
    // .where('article.user_id = :id', { id: user.id })
    // .orderBy({ 'article.updatedAt': 'DESC', 'id': 'DESC' })
    // .skip(page).take(pageSize)
    // .getManyAndCount();
    // return {lists: data, count};
  }

  /**
   * @desc Article list service
   * @desc not auth
   * */
  public async getFrontArticleList (query) {
    const {page, pageSize} = paging(query.page, query.pageSize);
    const [data, count] = await this.articleRepository.createQueryBuilder('article')
      .select(['article.id','article.title', 'article.introduction', 'user.username'])
      .leftJoin('article.user', 'user', 'article.user_id = user.id')
      .orderBy({ 'article.createdAt': 'DESC', 'article.id': 'DESC' })
      .offset(page).limit(pageSize)
      .getManyAndCount();
    return {lists: data, count};
  }

  /**
   * @desc Article detail
   * */
  public async getArticleDetail (articleId) {
    const result = await this.articleRepository.createQueryBuilder('article')
      .select(['article.id', 'article.title', 'article.content', 'article.createdAt', 'article.updatedAt', 'user.username'])
      .leftJoin('article.user', 'user', 'article.user_id = user.id')
      .where('article.id = :articleId', {articleId})
      .getOne();
    return { result };
  }

  /**
   * @desc 文章编辑回显
   * */
  public async editArticlePresentation (articleId, user: UsersEntity) {
    const result = await this.articleRepository.createQueryBuilder('article')
      .select(['article.id', 'article.title', 'article.content', 'article.introduction', 'article.original', 'tags'])
      .leftJoin('article.tags', 'tags')
      .where('article.id = :articleId', {articleId})
      .andWhere('article.user_id = :userId', {userId: user.id})
      .getOne();
    return { result };
  }

  /**
   * @desc 保存编辑
   * */
  public async editArticle (data, user: UsersEntity) {
    const {id, title, content, introduction, original, tag_id} = data;
    const value = plainToClass(ArticleEntity, {title, content, introduction, original});

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();

    // 开始事务
    await queryRunner.startTransaction();

    try {

      // 删除关联表对应tags
      await queryRunner.manager.createQueryBuilder(ArticleRelationsTagsEntity, 'relations')
        .delete()
        .where('article_id = :id', {id: id})
        .execute();

      // 插入对应tags
      if (Array.isArray(tag_id) && tag_id) {
        // 标签存在情况下
        tag_id.forEach(async (item) => {
          await queryRunner.manager.insert<ArticleRelationsTagsEntity>(ArticleRelationsTagsEntity, {
            article_id: id,
            tag_id: item
          });
        });
      }

      // 修改文章
      await this.articleRepository.createQueryBuilder('article')
        .update()
        .set(value)
        .where('article.id = :articleId', {articleId: id})
        .andWhere('article.user_id = :userId', {userId: user.id})
        .execute();

      // 提交事务
      await queryRunner.commitTransaction();

      return { message: '修改成功' };
    } catch (e) {
      // 回滚事务
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e);
    }
  }

  /**
   * @desc Create article service
   * */
  public async createArticle (data, user: UsersEntity) {
    const {title, content, original, introduction, tag_id} = data;
    const findDuplicationTitle = await this.articleRepository.findOne({title});
    if (findDuplicationTitle) {
      throw new BadRequestException(MESSAGES.TITLE_ALREADY_EXISTS_ERROR);
    }
    const value = plainToClass(ArticleEntity, {title, content, user, introduction, original});

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();

    // 开始事务
    await queryRunner.startTransaction();

    try {
      const createHandle = await queryRunner.manager.createQueryBuilder(ArticleEntity, 'article')
        .insert()
        .into(ArticleEntity)
        .values(value)
        .execute();
      const articleId = createHandle.raw.insertId;
      if (Array.isArray(tag_id) && tag_id) {
        // 标签存在情况下
        tag_id.forEach(async (item) => {
          await queryRunner.manager.insert<ArticleRelationsTagsEntity>(ArticleRelationsTagsEntity, {
            article_id: articleId,
            tag_id: item
          });
        });
      }
      // 提交事务
      await queryRunner.commitTransaction();

      return {message: `成功创建${createHandle.raw.affectedRows}条`};
    } catch (e) {
      // 回滚事务
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e);
    }
  }

  /**
   * @desc Delete article
   * */
  public async deleteArticle (id = -1, user: UsersEntity) {

    const coverValue = Array.isArray(id) ? id : Array.of(id);

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();

    // 开始事务
    await queryRunner.startTransaction();

    try {
      const {raw: { affectedRows } } = await queryRunner.manager.createQueryBuilder(ArticleEntity, 'article')
        .delete()
        .where(`article.id IN (:...id)`, {id: coverValue})
        .andWhere('article.user_id = :userId', {userId: user.id})
        .execute();

      // 同时删除关联表
      await queryRunner.manager.createQueryBuilder(ArticleRelationsTagsEntity, 'relations')
        .delete()
        .where('article_id IN (:...id)', {id: coverValue})
        .execute();

      // 提交事务
      await queryRunner.commitTransaction();

      return {message: `成功删除${affectedRows}条`};

    } catch (e) {
      // 回滚事务
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e);
    }
  }

  /**
   * @desc 文章上传图片
   * */
  public async articleUploadPic (file) {
    return await this.uploadService.upload(file, 'images');
  }

  /**
   * @desc 删除图片
   * */
  public async articleDeletePic ({ id }) {
    return await this.uploadService.delete(id, 'images');
  }

}
