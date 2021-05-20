<template>
  <div class="panel">
    <article-components @success="publishArticleHandle" ref="articleComponents"></article-components>
  </div>
</template>
<script>
import ArticleComponents from "./components/Article";
import { success } from '@/plugins/core/lib';
export default {
  components: {
    ArticleComponents
  },
  methods: {
    async publishArticleHandle (params) {
      const { data } = await this.$axios.post('/article/create', params);
      if (success(data.code)) {
        this.$notify({ title: '成功', message: '发布文章成功', type: 'success' });
        this.$refs['articleComponents'].resetFields();
      }
    }
  }
}
</script>
