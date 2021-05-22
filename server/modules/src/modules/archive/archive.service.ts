import {Injectable, BadRequestException} from '@nestjs/common';
import { Connection } from "typeorm";

import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {TagsEntity} from 'src/entity/tags.entity';
import {ArticleRelationsTagsEntity} from 'src/entity/articleRelationsTags.entity';
import {ArticleEntity} from 'src/entity/article.entity';
import { paging, groupBy } from 'src/core/lib';
import {plainToClass} from 'class-transformer';
import { MESSAGES } from 'src/core/enums/message.enum';

@Injectable()
export class ArchiveService {
  constructor(
    private connection: Connection,
    @InjectRepository(TagsEntity) private readonly tagsRepository: Repository<TagsEntity>,
    @InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(ArticleRelationsTagsEntity) private readonly articleRelationsRepository: Repository<ArticleRelationsTagsEntity>,
  ) {}

  /**
   * @desc 获取标签列表
   * @param query {object} page 当前页数
   * @param query {object} pageSize 当前显示条数
   * */
  public async getTagLists (query) {
    const {page, pageSize} = paging(query.page, query.pageSize);
    const getTagsHandle = await this.tagsRepository.createQueryBuilder('tag')
      .select(['tag', 'article.title', 'article.id'])
      .leftJoin('tag.articleLists', 'article')
      .orderBy({ 'tag.updatedAt': 'DESC', 'tag.id': 'DESC' });

    if (query['no-pagination']) {
      // 查询所有数据
      return await getTagsHandle.getMany();
    } else {
      const [data, count] = await getTagsHandle
        .offset(page).limit(pageSize)
        .getManyAndCount();
      return {list: data, count};
    }
  }

  /**
   * @desc 获取单个标签详情
   * @desc not auth
   * */
  public async getSingleTagHandle ({ id }) {
    return await this.tagsRepository.findOne({id});
  }

  /**
   * @desc 获取标签关联文章列表
   * @desc not auth
   * */
  public async getTagRelationsArticle ({ id }) {
    const tagRelationsArticleLists = await this.articleRelationsRepository.createQueryBuilder('articleRelations')
      .select(['article.title AS title', 'article.id AS id', 'article.createdAt AS createdAt', 'article.banner AS banner'])
      .leftJoin('articleRelations.article_id', 'article')
      .where('articleRelations.tag_id =:id', { id })
      .getRawMany();
    const handleArticleLists = tagRelationsArticleLists.map(v => {
      if (v.banner == null || v.banner == '') return { ...v, banner: '' };
      return { ...v, banner: JSON.parse(v.banner) }
    });
    return { list: handleArticleLists };
  }

  /**
   * @desc 创建标签
   * */
  public async createTagHandle (body) {
    const { name, introduction } = body;
    const findDuplicationName = await this.tagsRepository.findOne({name});
    if (findDuplicationName) {
      throw new BadRequestException(MESSAGES.TAG_NAME_ALREADY_EXISTS_ERROR);
    }
    const value = plainToClass(TagsEntity, {name, introduction});
    const { raw: { affectedRows } } = await this.tagsRepository.createQueryBuilder('tags')
      .insert()
      .into(TagsEntity)
      .values(value)
      .execute();
    return {message: `成功创建${affectedRows}条`};
  }

  /**
   * @desc 编辑标签
   * @param body {object} id 编辑标签标识
   * @param body {object} name 标签名称
   * @param body {object} introduction 标签简介
   * */
  public async editTagHandle (body) {
    const { id, name, introduction } = body;
    const value = plainToClass(TagsEntity, { name, introduction });
    const { affected } = await this.tagsRepository.createQueryBuilder('tags')
      .update()
      .set(value)
      .where('tags.id = :id', { id })
      .execute();
    return {message: `成功修改${affected}条`};
  }

  /**
   * @desc 删除标签
   * */
  public async deleteTagHandle (body) {
    const coverValue = Array.isArray(body.id) ? body.id : Array.of(body.id);
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    // 开始事务
    await queryRunner.startTransaction();

    try {

      const {raw: { affectedRows } } = await queryRunner.manager.createQueryBuilder(TagsEntity, 'tags')
        .delete()
        .where('tags.id IN (:...id)', {id: coverValue})
        .execute();

      await queryRunner.manager.createQueryBuilder(ArticleRelationsTagsEntity, 'relations')
        .delete()
        .where('tag_id IN (:...id)', { id: coverValue })
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
   * @desc 文章分类列表
   * @desc not auth
   * */
  public async getArchiveLists () {
    const statistical = await this.articleRepository.createQueryBuilder('article')
      .select(['article.id AS id', 'article.title AS title', "FROM_UNIXTIME( `article`.`createdAt`, '%Y年%m月' ) AS `date`", "FROM_UNIXTIME( `article`.`createdAt`, '%m-%d' ) AS `times`"])
      .groupBy('article.id')
      .orderBy({'article.createdAt': 'DESC', 'article.id': 'DESC'})
      .getRawMany();

    return groupBy(statistical, 'date');
  }

}
