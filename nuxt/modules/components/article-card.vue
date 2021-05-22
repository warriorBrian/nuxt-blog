<template>
  <div>
    <section class="container">
      <section class="card-box" v-for="(items, index) in articleLists" :key="index">
        <div class="card-content" :style="{backgroundImage: 'url(' + (items.banner ? convertURL(items.banner.link) : defaultArticleBackground) + ')'}" @click="navigationHandle(items)">
          <div class="article-card-mask">
            <h2 class="article-card-title">{{ items.title }}</h2>
            <p class="article-card-times">
              <span>{{ items['createdAt'] | coverTimes }}</span>
              <no-ssr>
                <el-divider v-if="items['tags'] && items['tags'].length" direction="vertical"></el-divider>
              </no-ssr>
              <span v-if="items['tags']">{{ items['tags'] | filterTags }}</span>
            </p>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>
<script>
import convertURL from '~/plugins/core/lib/internal/convertURI';
import { dateProcess } from '~/plugins/core/lib';
export default {
  filters: {
    coverTimes (val) {
      return dateProcess(val, 'YYYY 年 MM 月 DD 日');
    },
    filterTags (val) {
      return val.length ? val.map(v => v.name).join('·') : '';
    }
  },
  props: {
    articleLists: {
      type: Array,
      required: true,
      default: () => ([])
    }
  },
  data () {
    return {
      defaultArticleBackground: '/images/article-bg.jpg'
    }
  },
  methods: {
    convertURL,
    navigationHandle (params) {
      this.$router.push({ name: 'article-id', params: { id: params.id } });
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
</style>
