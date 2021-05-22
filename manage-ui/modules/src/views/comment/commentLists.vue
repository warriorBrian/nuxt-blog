<template>
  <div class="panel commentLists">
    <!--左侧文章列表-->
    <custom-article class="custom-article-component"></custom-article>
    <!--右侧评论列表-->
    <custom-comment class="custom-comment-component" :loading="loading" :dataSource="commentDataSource" :current-page="currentPage" @change="commentPageChange"></custom-comment>
  </div>
</template>

<script>
import customArticle from "./components/customArticle";
import customComment from "./components/customComment";
export default {
  components: {
    customArticle,
    customComment
  },
  name: 'commentLists',
  data () {
    return {
      commentDataSource: {},
      articleId: null,
      currentPage: {
        page: 1,
        pageSize: 15
      },
      loading: false
    }
  },
  created () {
    // 点击左侧文章列表触发，使用虚拟滚动，使用eventBus传递值
    this.$eventBus.$on('articleListClickHandle', id => {
      this.articleId = id;
      this.currentPage = { page: 1, pageSize: 15 };
      this.getCommentLists(this.articleId);
    });
    this.getCommentLists();
  },
  methods: {
    // 获取评论列表
    async getCommentLists (id, args) {
      this.loading = true;
      const { data: { data } } = await this.$axios.get('/comment', { params: { id, ...args } });
      this.commentDataSource = data;
      this.loading = false;
    },
    commentPageChange (paginationData) {
      const value = paginationData || { page: 1, pageSize: 15 };
      this.getCommentLists(this.articleId, value);
    }
  },
  beforeDestroy () {
    this.$eventBus.$off('articleListClickHandle');
  }
}
</script>

<style scoped lang="less">
.commentLists {
  display:flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: nowrap;
}
.commentLists.panel /deep/{
  min-height: 780px;
}
.custom-article-component {
  width: 20%;
}
.custom-comment-component {
  width: 77%;
}
</style>
