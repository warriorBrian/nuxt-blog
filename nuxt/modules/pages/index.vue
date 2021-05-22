<template>
  <div>
    <!-- banner -->
    <custom-banner :list="list"></custom-banner>
    <!-- card content -->
    <article-card :article-lists="lists"></article-card>
    <!-- page -->
    <custom-page @current-change="currentPageChangeHandle" :total="count"></custom-page>
  </div>
</template>

<script>
import customBanner from '~/layouts/custom-banner';
import customPage from '~/components/custom-page';
import articleCard from '~/components/article-card';
export default {
  components: {
    customBanner,
    customPage,
    articleCard
  },
  data () {
    return {
      lists: [],
      params: {
        page: 1,
        pageSize: 15
      },
      meta: {
        title: '',
        description: '',
        keywords: '',
        author: ''
      },
      count: 0,
      list: {}
    }
  },
  async fetch () {
    await this.getBannerData();
    await this.getSiteMetaConfig();
    await this.getArticleLists();
  },
  head () {
    return {
      title: this.meta.title,
      meta: [
        { hid: 'description', name: 'description', content: this.meta.description },
        { hid: 'keywords', name: 'keywords', content: this.meta.keywords },
        { hid: 'author', content: this.meta.author }
      ]
    }
  },
  methods: {
    // 获取banner数据
    async getBannerData () {
      try {
        const { data: { data } } = await this.$axios.get('/site-config/list', {});
        // 查找数据与路由进行对应
        const index = data.list.findIndex(v => v.link === this.$route.path);
        this.list = data.list[index];
      } catch (e) {
        this.$nuxt.error({ ...e.response.data });
      }
    },
    // 获取网站元数据设置
    async getSiteMetaConfig () {
      const { data: { data } } = await this.$axios.get('/site-config/site');
      this.meta = data;
    },
    // 获取文章列表渲染
    async getArticleLists () {
      try {
        const { data: { data } } = await this.$axios.get('/article/list', { params: { ...this.params } });
        this.count = data.count;
        this.lists = data.lists;
      } catch (e) {
        this.$nuxt.error({ ...e.response.data });
      }
    },
    currentPageChangeHandle (val) {
      this.params.page = val;
      this.getArticleLists();
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  margin: 0 auto;
  padding: 4rem 3.5rem 3.5rem;
  & .card-box {
    width: 100%;
    height: 250px;
    margin: 2rem auto 1.25rem;
    padding: 2rem 0 1.25rem;
    & .dynamic-bg {
      background-image: url("~static/image/article-bg.jpg") !important;
    }
    & .card-content {
      width: 100%;
      height: 100%;
      border: 1px solid #ebeef5;
      position: relative;
      border-radius: 10px;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      cursor: pointer;
      transition: 0.3s ease;
      transition-property: transform;
      transform: translateY(0);
      &:hover {
        transform: translateY(-4px) scale(1.05) translateZ(0);
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
      }
      & .article-card-mask {
        -webkit-font-smoothing: antialiased;
        display:flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        color:#fff;
        border-radius: 10px;
        background-color: rgba(0, 0, 0, 0.55);
        // 文章 title
        & .article-card-title {
          font-weight: 400;
          color:#fff;
          font-size: 1.56rem;
          max-width: 90%;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          margin-bottom: 0;
        }
        & .article-card-times {
          margin: 10px 0 0 0;
          padding: 0;
          font-size: 13px;
          font-weight: 400;
          color:#eee;
        }
      }
    }
  }
}
</style>
