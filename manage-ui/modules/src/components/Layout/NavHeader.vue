<template>
  <div class="doshBoard-layout-header">
    <!--animate__animated animate__rubberBand animate__faster-->
    <div class="router-name">{{this.$route.meta.title}}</div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-submenu index="2" class="doshBoard-layout-header-userInfo">
        <template slot="title">{{username}}</template>
        <el-menu-item index="2-1">退出</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import SessionStorage from '../../plugins/core/lib/session'
const session = new SessionStorage();
export default {
  name: 'NavHeader',
  data () {
    return {
      activeIndex: '1',
      username: ''
    }
  },
  created () {
    const { username } = session.getItem('user_info');
    this.username = username;
  }
}
</script>

<style scoped lang="less">
 @import "./style/index.less";
</style>
