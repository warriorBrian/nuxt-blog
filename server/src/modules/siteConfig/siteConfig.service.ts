import {Injectable, BadRequestException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, Connection} from 'typeorm';
import {SiteEntity} from 'src/entity/site.entity';
import {paging} from 'src/core/lib';
import {UploadService} from 'src/upload/upload.service';

@Injectable()
export class SiteConfigService {
  private siteType = ['index', 'navigation'];
  private subCount = 0;
  constructor(
    private connection: Connection,
    private readonly uploadService: UploadService,
    @InjectRepository(SiteEntity) private readonly siteRepository: Repository<SiteEntity>
  ) {}

  /**
   * @desc 获取站点配置信息列表
   * @desc not auth
   * */
  public async getSiteConfigLists () {
    const siteLists = await this.siteRepository.createQueryBuilder('site')
      .orderBy({'site.parentId': 'ASC', 'site.id': 'ASC'})
      .getMany();
    const handleData = siteLists.reduce((acc, val) => {
      const index = acc.findIndex(v => v.id === val.parentId);
      // 如果找不到则创建
      !~index && acc.push({...val, children: []});
      // 如果找到则新增子集
      !!~index && acc[index].children.push(val);
      return acc;
    }, []);
    return { list: handleData };
  }

  /**
   * @desc 获取站点配置信息列表
   * */
  public async getSiteConfigHandle (query) {
    return this.getSiteConfigLists();
    // const {page, pageSize} = paging(query.page, query.pageSize);
    // const siteLists = await this.siteRepository.createQueryBuilder('site')
    //   .select()
    //   .offset(page).limit(pageSize)
    //   .orderBy({"site.type": 'ASC', 'site.id': 'DESC'})
    //   .getMany();
    // const res = siteLists.reduce((acc, val) => {
    //   const index = acc.findIndex(v => v.id === val.parentId);
    //   const relation = !!~index ? acc[index].title : '';
    //   acc.push({...val, relation});
    //   return acc;
    // }, []);
    // return { list: res };
  }

  /**
   * @desc 获取父级列表用于创建关联关系
   * */
  public async getSiteRelationsLists () {
    return await this.siteRepository.createQueryBuilder('site')
      .select(['site.id', 'site.title'])
      .where('site.type =:type', {type: 'navigation'})
      .andWhere('site.parentId =:parentId', {parentId: 0})
      .getMany();
  }

  /**
   * @desc 创建站点配置信息
   * */
  public async createSiteConfigHandle (body) {
    const {title, type, desc, subDesc, banner, parentId, link, linkType } = body;
    if (Object.is(type, 'index')) {
      throw new BadRequestException('首页数据不允许创建及删除');
    }
    if (!this.siteType.includes(type)) {
      throw new BadRequestException(`无法识别此类型，仅适用于:${this.siteType.toString()}`);
    }
    const {raw: { affectedRows }} = await this.siteRepository.createQueryBuilder('site')
      .insert()
      .values({title, type, desc, subDesc, banner, parentId: parentId || 0, link, linkType })
      .execute();
    return {message: `成功创建${affectedRows}条`};
  }

  /**
   * @desc 编辑站点信息
   * */
  public async editSiteConfigHandle (body) {
    const { id, title, type, desc, subDesc, banner, link, linkType, parentId } = body;
    if (Object.is(type, 'index') && (parentId !== 0 && parentId !== '')) {
      throw new BadRequestException('首页无法分配至某个子集');
    }
    const { affected } = await this.siteRepository.createQueryBuilder('site')
      .update()
      .set({ title, desc, subDesc, banner, link, linkType, parentId: parentId || 0 })
      .where('site.id = :id', { id })
      .andWhere('site.type =:type', { type })
      .execute();
    return {message: `成功修改${affected}条`};
  }

  /**
   * @desc 删除站点配置信息
   * */
  public async deleteSiteConfigHandle (body) {
    const coverValue = Array.isArray(body.id) ? body.id : Array.of(body.id);
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    // 开始事务
    await queryRunner.startTransaction();

    try {
      // 先进行删除前查找是否包含子集
      const findDuplicationId = await this.siteRepository.createQueryBuilder('site')
        .select(['site.id', 'site.banner'])
        .where('site.parentId IN (:...id)', {id: coverValue})
        .getMany();
      // 获取子集id列表
      const idLists = findDuplicationId.map(v => v.id);
      // banner list
      const bannerLists = findDuplicationId.map(v => v.banner)
        .map((k: any) => typeof k === 'object' ? k.id : k)
        .filter(Boolean);
      // 删除指定的值
      const {raw: { affectedRows } } = await queryRunner.manager.createQueryBuilder(SiteEntity, 'site')
        .delete()
        .where('site.id IN (:...id)', {id: coverValue})
        .andWhere('site.type =:type', {type: 'navigation'})
        .execute();
      // 同时删除包含图片
      const { banner } = await this.siteRepository.findOne({id: body.id}) as any;
      if (banner) {
        // 如果存在图片则删除对应图片
        await this.uploadService.delete(banner.id, 'site');
      }

      // 删除包含子集
      if (idLists.length) {
        const {raw: { affectedRows: subAffectedRows } } = await queryRunner.manager.createQueryBuilder(SiteEntity, 'site')
          .delete()
          .where('site.id IN (:...id)', {id: idLists})
          .andWhere('site.type =:type', {type: 'navigation'})
          .execute();

        // 循环删除对应图片
        bannerLists.forEach(async item => {
          await this.uploadService.delete(item, 'site');
        });
        this.subCount = subAffectedRows || 0;
      }

      // 提交事务
      await queryRunner.commitTransaction();

      return {message: `成功删除${affectedRows + this.subCount }条`};

    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e);
    }
    // const {raw: { affectedRows } } = await this.siteRepository.createQueryBuilder('site')
    //   .delete()
    //   .where('site.id IN (:...id)', {id: coverValue})
    //   .andWhere('site.type =:type', {type: 'navigation'})
    //   .execute();
    // return {message: `成功删除${affectedRows}条`};
  }

  /**
   * @desc 站点信息上传图片
   * */
  public async siteConfigUploadPic (file) {
    return this.uploadService.upload(file, 'site');
  }

  /**
   * @desc 站点信息删除图片
   * */
  public async siteConfigDeletePic ({ id }) {
    return this.uploadService.delete(id, 'site');
  }

}
