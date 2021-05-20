<template>
  <div class="dashBoard-layout">
    <el-container>
      <el-aside class="doshBoard-layout-aside">
        <navAside></navAside>
      </el-aside>
      <el-main>
        <nav-header></nav-header>
        <div class="dashBoard-layout-content">
          <router-view class="children-router"></router-view>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import NavAside from './NavAside'
import NavHeader from './NavHeader'
export default {
  name: 'Index.vue',
  components: {
    NavAside,
    NavHeader
  }
}
</script>

<style scoped lang="less">
 @import "./style/index";
</style>
