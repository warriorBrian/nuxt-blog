<template>
  <div class="panel">
    <article-component edit :formData="detailData" @success="editArticleHandle"></article-component>
  </div>
</template>

<script>
import { success } from '@/plugins/core/lib';
import articleComponent from './components/Article';
export default {
  name: 'articleDetail',
  components: {
    articleComponent
  },
  data () {
    return {
      detailData: null
    }
  },
  created () {
    this.initialData(this.$route.params.id);
  },
  methods: {
    async initialData (id) {
      const { data: { data } } = await this.$axios.get(`/article/edit/${id}`);
      this.detailData = Object.assign({}, data.result);
    },
    async editArticleHandle (params) {
      const value = { id: this.$route.params.id, ...params };
      const { data } = await this.$axios.put('/article', value);
      if (success(data.code)) {
        this.$notify({ title: '成功', message: '修改成功', type: 'success' });
        this.initialData(this.$route.params.id);
      }
    }
  }
}
</script>

<style scoped>

</style>
