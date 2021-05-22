<template>
  <div>
    <!-- banner -->
    <custom-banner class="archive-detail-banner" :list="{ banner }" :default-banner="defaultBanner">
      <section slot="title" class="archive-detail-title">{{ detail.name }}</section>
      <section slot="desc">
        <span class="archive-times">{{ detail.createdAt | filterTimes }}</span>
      </section>
    </custom-banner>
    <!-- card container -->
    <article-card :article-lists="articleLists"></article-card>
  </div>
</template>
<script>
import customBanner from '~/layouts/custom-banner';
import { dateProcess } from '~/plugins/core/lib';
import articleCard from '~/components/article-card';
export default {
  components: {
    customBanner,
    articleCard
  },
  filters: {
    filterTimes (val) {
      return val ? dateProcess(val, 'YYYY 年 MM 月 DD 日') : '';
    },
  },
  data () {
    return {
      detail: {
        name: '',
        createdAt: ''
      },
      defaultBanner: '/image/archive-detail-banner.jpeg',
      defaultArticleBackground: '/image/article-bg.jpg',
      banner: '',
      articleLists: []
    }
  },
  async fetch () {
    const id = this.$route.params.id;
    await this.getTagContentHandle(id);
    await this.getTagDetailHandle(id);
  },
  head () {
    return {
      title: this.detail.name
    }
  },
  methods: {
    // 获取标签详情简介等
    async getTagContentHandle (id) {
      const { data: { data } } = await this.$axios.get('/archive/tag/single', { params: { id } });
      this.detail = data;
    },
    // 获取标签关联文章等
    async getTagDetailHandle (id) {
      const { data: { data } } = await this.$axios.get('/archive/tag/detail', { params: { id } });
      // 随机从存在banner的文章中选取一个banner
      const list = data.list.filter(v => v.banner);
      const index = Math.floor(Math.random() * list.length);
      list.length > 0 && (this.banner = list[index].banner);
      // 设置文章列表
      this.articleLists = data.list;
    },
    navigationHandle () {}
  }
}
</script>
<style scoped lang="less">
.archive-detail-banner {
  & .archive-times {
    font-size: 13px;
  }
}
</style>
