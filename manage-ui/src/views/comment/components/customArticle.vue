<template>
  <div class="customArticle-box">
    <virtual-list
      class="customArticle-virtual-list"
      :data-key="'id'"
      :data-sources="items"
      :data-component="itemComponent"
      :estimate-size="70"
    ></virtual-list>
  </div>
</template>

<script>
import VirtualList from 'vue-virtual-scroll-list';
import Items from './items'
export default {
  name: 'customArticle',
  components: {
    VirtualList
  },
  data () {
    return {
      itemComponent: Items,
      items: []
    }
  },
  created () {
    this.$eventBus.$on('articleListClickHandle', id => {
      this.handleItemListActive(id);
    });
    this.initialArticleLists();
  },
  methods: {
    async initialArticleLists (id) {
      const { data: { data } } = await this.$axios.get('/comment/articleRelations');
      this.items = data;
    },
    /**
     * 在数据基础上增加active
     * virtual-list在items组件中如果不更新数据情况下不会更新data中的变量
     * 类似缓存，如果在items中定义data，每次设置这个变量则不会更新，对于每一列而言
     * 当前列的active不会再次更新，所以需要每次更新列表数据
     * 调用每次更新列表数据
     * */
    handleItemListActive (id) {
      this.items = this.items.map(item => ({ ...item, active: id }));
    }
  },
  beforeDestroy () {
    this.$eventBus.$off('articleListClickHandle');
  }
}
</script>

<style scoped lang="less">
.customArticle-box {
  width: 300px;
  border: 1px solid #ebebeb;
  margin: 25px 0 0 0;
  & .customArticle-virtual-list {
    height: 730px;
    overflow-y: auto;
  }
}
</style>
