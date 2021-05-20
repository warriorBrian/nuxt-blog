<template>
  <div class="dashBoard-layout-NavLeft">
    <el-menu background-color="#545c64" text-color="#fff" @select="doshBoardLeftMenuHandle" :default-active="activeIndex" class="el-menu-demo" mode="vertical">
      <!--logo临时占位-->
      <div style="width: 60%;height:50px;background:#fff;margin:10px auto;border-radius: 5px;"></div>
      <div v-for="(item, index) in menuLists" :key="index">
        <!-- 子集渲染,递归组件,选中值为数据中的路由(url) -->
        <child-menu :menu="item" v-if="item['subs']" :key="index"></child-menu>
        <!--非子集渲染-->
        <el-menu-item :index="item.url" v-else :class="{'active-menu': renderList(activeIndex, item.url)}" :disabled="item.disabled">
          <i v-if="item.icon" class="icon iconfont navLeft-menu-item-icon" :class="item.icon"></i>
          {{item.label}}
        </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script>
import ChildMenu from './ChildMenu'
import { compact, head, gte } from '@/plugins/core/lib'
import menu from './menu'
export default {
  name: 'NavAside',
  components: { ChildMenu },
  data () {
    return {
      activeIndex: '',
      // 左侧渲染列表
      menuLists: menu
    }
  },
  created () {
    this.activeIndex = this.$route.path;
  },
  methods: {
    doshBoardLeftMenuHandle (index, indexPath) {
      this.activeIndex = index;
      this.$router.push({ path: index })
    },
    renderList (activeIndex, url) {
      const prefix = '/';
      // 按 / 分割，将多级路由分割成数组
      const splitRouterList = this.$route['fullPath'].split('/');
      // 将数组中所有假值删除
      const compactList = compact(splitRouterList);
      // 如果数组长度大于2，则使用prefix + 数组第一个，表示一级路由，与渲染值对比，否则使用选中值对比
      return gte(compactList.length, 2) ? Object.is(prefix + head(compactList), url) : Object.is(activeIndex, url);
    }
  }
}
</script>

<style scoped lang="less">
  @import "./style/index";
</style>
