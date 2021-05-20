<template>
  <div>
    <!-- banner -->
    <custom-banner class="article-detail-banner" :list="{ banner: detail.banner }" :defaultBanner="defaultBanner">
      <section slot="title" class="detail-title">{{ detail.title }}</section>
      <section slot="desc">
        <span class="detail-times">{{ detail['createdAt'] | filterTimes }}</span>
        <span class="detail-tags">{{ detail['tags'] | filterTags }}</span>
      </section>
    </custom-banner>
    <no-ssr>
      <section class="panel article-content-area" v-highlight>
        <div v-html="detail.content" style="color:#333;"></div>
      </section>
    </no-ssr>
    <!-- 评论功能 -->
    <section class="panel article-detail-content" v-if="detail.content">
      <no-ssr>
        <el-divider>文章评论</el-divider>
        <post-form @success="getCommentLists"></post-form>
      </no-ssr>
    </section>
    <!-- 评论列表 -->
    <section class="panel article-detail-content" v-if="commentLists.length">
      <h3 class="comment-list-title">已有 {{ commentLists.length }} 条评论</h3>
      <section class="comment-list-content">
        <div v-for="(comment, index) in commentLists" :key="index" class="comment-list-content-item">
          <i class="icon iconfont icon-txxg"></i>
          <div>
            <p class="comment-username">{{ comment.username }}</p>
            <p class="comment-time">{{ comment['createdAt'] | filterCommentDate }}</p>
            <p class="comment-content">{{ comment.content }}</p>
            <el-alert v-if="comment['sensitive'].length > 3" title="此评论可能包含过多敏感内容" type="warning" show-icon :closable="false"></el-alert>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>
<script>

import customBanner from '~/layouts/custom-banner';
import { dateProcess } from '~/plugins/core/lib';
import postForm from '~/components/post-form';
import empty from '~/components/empty'
export default {
  components: {
    customBanner,
    postForm,
    empty
  },
  filters: {
    filterTimes (val) {
      return dateProcess(val, 'YYYY 年 MM 月 DD 日');
    },
    filterCommentDate (val) {
      return dateProcess(val, 'YYYY 年 MM 月 DD 日 hh:mm:ss')
    },
    filterTags (val) {
      return val.length ? val.map(v => v.name).join('·') : '';
    }
  },
  async asyncData ({ app, params, error }) {
    try {
      const { data: { data } } = await app.$axios.get(`/article/detail/${params.id}`);
      return { detail: data.result };
    } catch (e) {
      error({ ...e.response.data })
    }
  },
  data () {
    return {
      geet: {},
      commentLists: [],
      comment_status: 1,
      defaultBanner: 'https://images.pexels.com/photos/238118/pexels-photo-238118.jpeg?cs=srgb&dl=pexels-j%C3%A9shoots-238118.jpg&fm=jpg'
    }
  },
  async fetch () {
    // 评论列表
    await this.getCommentLists();
  },
  head () {
    return {
      title: this.detail.title,
      meta: [
        { hid: 'description', name: 'description', content: this.detail.introduction },
        { hid: 'author', content: this.detail.user.username || '' }
      ]
    }
  },
  methods: {
    async getCommentLists () {
      try {
        const { data: { data } } = await this.$axios.get('/comment/list', { params: { article_id: this.$route.params.id } });
        this.commentLists = data.list;
      } catch (e) {
        this.$nuxt.error({ ...e.response.data });
      }
    }
  }
}
</script>
<style lang="less" scoped>
.detail-tags {
  margin-left: 10px;
  color:#1abc9c;
}
.article-detail-banner {
  & /deep/ .banner {
    filter: blur(4px);
  }
}
.detail-title {
  max-width: 90%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin: 0 auto;
  font-size: 2.0rem;
}
.article-detail-content {
  margin: 20px auto;
  & .comment-list-title {
    font-weight: 400;
  }
}
.article-content-area {
  margin: 40px auto;
  min-height: 750px;
}
.comment-list-content {
  & .comment-list-content-item {
    margin-bottom: 2rem;
    display:flex;
    justify-content: flex-start;
    align-items: flex-start;
  }
  & .icon-txxg {
    margin-top: 0.5rem;
    margin-right: 1.2rem;
    font-size: 32px;
    color:#888;
  }
  /* 评论名称 */
  & .comment-username {
    color:#1abc9c;
    font-style: normal;
    margin: 0 0 5px 0;
  }
  & .comment-time {
    font-size: 12px;
    font-weight: 300;
    margin: 0;
    padding: 0;
    color:#444;
  }
  & .comment-content {
    font-weight: 400;
    line-height: 1.5;
    word-wrap: break-word;
    color:#333;
    font-size: 0.9rem;
  }
}
</style>
