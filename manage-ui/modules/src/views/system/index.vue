<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="systemTabsChangeHandle">
      <el-tab-pane label="配置中心" name="configurationCenter"></el-tab-pane>
      <el-tab-pane label="邮箱配置" name="email"></el-tab-pane>
      <el-tab-pane label="GoogleAuthentication" name="googleAuthentication"></el-tab-pane>
      <el-tab-pane label="腾讯位置服务配置" name="webService"></el-tab-pane>
      <el-tab-pane label="访问黑名单" name="blacklist" v-if="Boolean(status)"></el-tab-pane>
      <el-tab-pane label="图片上传配置" name="uploadPic"></el-tab-pane>
<!--      <el-tab-pane label="定时任务补偿" name="fourth" :disabled="true"></el-tab-pane>-->
    </el-tabs>
    <!--leave-active-class="animate__animated animate__fadeInRight" -->
    <transition name="fade" enter-active-class="animate__animated animate__fadeInRight animate__faster">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'index',
  data () {
    return {
      activeName: 'safe'
    }
  },
  computed: {
    ...mapGetters({
      status: 'config/status'
    })
  },
  created () {
    this.activeName = this.$route.name;
    this.initialStatus();
  },
  methods: {
    async initialStatus () {
      const { data: { data } } = await this.$axios.get('/blacklist/status');
      this.$store.dispatch('config/setBlacklistStatus', data.status);
    },
    systemTabsChangeHandle (tab) {
      this.$router.push({ name: this.activeName });
    }
  }
}
</script>

<style scoped>

</style>
