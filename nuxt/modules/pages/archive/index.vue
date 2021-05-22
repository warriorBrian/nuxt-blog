<template>
  <div>
    <!-- banner -->
    <custom-banner :list="list"></custom-banner>
    <section class="container-box archive-container-box">
      <!-- 标签集合 -->
      <section class="archive-tag-list" v-if="tagLists.length">
        <h2 class="archive-title">标签集合</h2>
        <div class="archive-content">
          <span v-for="(items, index) in tagLists" :key="index" class="archive-tag" @click="navigatorTagHandle(items)">
            {{ items.name }}
          </span>
        </div>
      </section>
      <!-- 按日期文章分类 -->
      <section class="archive-list" v-if="Object.keys(archiveLists).length">
        <h2 class="archive-title">文章归档</h2>
        <div v-for="(archive, key, index) in archiveLists" :key="index" class="archive-content">
          <p class="archive-sub-title">{{ key }}</p>
          <section>
            <div v-for="(list, idx) in archive" :key="idx" class="archive-article-content" @click="navigatorHandle(list)">
              <span class="archive-article-times">{{ list['times'] }}</span>
              <span class="archive-article-title">{{ list['title'] }}</span>
            </div>
          </section>
        </div>
      </section>
    </section>
  </div>
</template>
<script>
import customBanner from '~/layouts/custom-banner';
export default {
  name: 'archive',
  components: {
    customBanner
  },
  data () {
    return {
      tagLists: [],
      archiveLists: {},
      list: {}
    }
  },
  async fetch () {
    await this.getBannerData();
    await this.getTagLists();
    await this.getArchiveLists();
  },
  head () {
    return {
      title: '归档'
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
    async getTagLists () {
      const { data: { data } } = await this.$axios.get('/archive/tag/list', { params: { 'no-pagination': true } })
      this.tagLists = data;
    },
    async getArchiveLists () {
      const { data: { data } } = await this.$axios.get('/archive/list')
      this.archiveLists = data;
    },
    navigatorHandle (params) {
      this.$router.push({ name: 'article-id', params: { id: params.id } });
    },
    navigatorTagHandle (params) {
      const { id, name, introduction, createdAt } = params;
      this.$router.push({ name: 'archive-id', params: { id, name, introduction, createdAt } });
    }
  }
}
</script>
<style lang="less" scoped>
.archive-container-box {
  padding: 4rem 3.5rem 3.5rem;
}
.archive-title {
  font-size: 28px;
  font-weight: 300;
}
.archive-content {
  margin-left: 1.2rem;
  margin-bottom: 2rem;
}
.archive-tag {
  font-size: 16px;
  font-weight: 400;
  padding: 5px 20px;
  cursor: pointer;
  transition: 0.3s ease all;
  &:hover {
    background:#eee;
    border-radius: 50px;
  }
}

/* 文章分类 */
.archive-list {
  margin-top: 5rem;
  & .archive-sub-title {
    font-size: 19px;
    font-weight: 400;
  }
  & .archive-article-content {
    margin: 1rem 0;
    max-width: 90%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    cursor: pointer;
    padding: 0.5rem 1.5rem;
    transition: 0.3s ease all;
    &:hover {
      background:#eee;
      border-radius: 5px;
    }
    & .archive-article-times {
      font-weight: 300;
    }
    & .archive-article-title {
      margin-left: 10px;
      font-weight: 300;
    }
  }
}
</style>
