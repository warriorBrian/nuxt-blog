<template>
  <div class="doshBoard-layout-header">
    <!--animate__animated animate__rubberBand animate__faster-->
    <div class="router-name">{{this.$route.meta.title}}</div>
    <el-menu :default-active="activeIndex" class="layout-menu" mode="horizontal">
      <el-submenu index="1" class="doshBoard-layout-header-userInfo" :popper-append-to-body="true" popper-class="layout-menu-sub">
        <template slot="title">{{username}}</template>
        <el-menu-item index="1-1" @click="logoutHandle" style="text-align: center">退出</el-menu-item>
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
  },
  methods: {
    logoutHandle () {
      session.removeItem('access_token');
      session.removeItem('user_info');
      this.$router.push({ name: 'login' });
    }
  }
}
</script>

<style scoped lang="less">
 @import "./style/index.less";
</style>
