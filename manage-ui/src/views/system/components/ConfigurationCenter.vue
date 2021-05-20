<template>
  <div class="panel">
    <section>
      <h3 class="item-title no-select">访问黑名单 <i class="el-icon-question guide" @click="blacklistGuideHandle"></i> </h3>
      <div class="blacklist-switch-content item-title-content">
        <span class="blacklist-switch-text">验证器开关</span>
        <el-switch v-model="blacklistStatus" class="blacklist-switch-components" @change="changeBlacklistStatus" :active-value="1" :inactive-value="0"></el-switch>
      </div>
    </section>
    <!--站点元数据配置-->
    <site-config></site-config>
  </div>
</template>

<script>
import { blacklist } from './../guide/config-guide';
import siteConfig from './configure/siteConfig';
import { success } from '@/plugins/core/lib';
export default {
  name: 'configurationCenter.vue',
  components: {
    siteConfig
  },
  data () {
    return {
      blacklistStatus: 0
    }
  },
  created () {
    this.initialBlacklistStatus();
  },
  methods: {
    async initialBlacklistStatus () {
      const { data: { data } } = await this.$axios.get('/blacklist/status');
      this.blacklistStatus = data.status;
      this.$store.dispatch('config/setBlacklistStatus', data.status);
    },
    async changeBlacklistStatus (status) {
      const { data } = await this.$axios.post('/blacklist/status', { status });
      if (success(data.code)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.initialBlacklistStatus();
      }
    },
    blacklistGuideHandle () {
      this.$driver.defineSteps(blacklist);
      this.$driver.start();
    }
  }
}
</script>

<style scoped lang="less">
@import "./../style/config";
</style>
