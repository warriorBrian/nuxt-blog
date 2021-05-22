<template>
  <div class="panel">
    <section>
      <h3 class="item-title no-select">谷歌身份验证器策略 <i class="el-icon-question guide" @click="googleAuthGuideHandle"></i> </h3>
      <div class="googleAuth-switch-content">
        <span class="googleAuth-switch-text">验证器开关</span>
        <el-switch v-model="googleAuthStatus" class="googleAuth-switch-components" @change="changeAuthStatus" :active-value="1" :inactive-value="0"></el-switch>
      </div>
      <h3 class="item-title googleAuth-config">谷歌身份验证器配置</h3>
      <section class="googleAuth-qrCode-content">
        <img :src="qrCode" alt="" class="googleAuth-qrCode">
        <div class="googleAuth-qrCode-mask" @click="refreshQrCodeHandle">
          <i class="el-icon-refresh googleAuth-qrCode-mask-icon"></i>
          <span class="googleAuth-qrCode-mask-text">点击更换二维码</span>
        </div>
      </section>
      <h3 class="item-title">绑定测试</h3>
      <section class="googleAuth-qrCode-test-content">
        <el-input type="text" class="googleAuth-qrCode-test-input" size="small" placeholder="请输入绑定验证码" v-model="googleAuthCode" maxlength="6" show-word-limit></el-input>
        <el-button type="primary" class="googleAuth-qrCode-test-btn" size="small" @click="authTestHandle">测试</el-button>
        <i class="googleAuth-icon" :class="authTestStatus !== '' ? `el-icon-${ calculateIcon() }` : ''"></i>
      </section>
    </section>
  </div>
</template>

<script>
import googleAuthGuide from './../guide/googleAuth-guide'
export default {
  name: 'GoogleAuth',
  data () {
    return {
      // qrCode
      qrCode: '',
      // google switch status
      googleAuthStatus: 0,
      // input google code
      googleAuthCode: '',
      // test icon
      authTestStatus: '',
    }
  },
  created () {
    this.initData();
    this.getAuthStatus();
  },
  methods: {
    async initData (update = 0) {
      const { data: { data } } = await this.$axios.get('/googleAuth', { params: { update } });
      this.qrCode = data.code;
    },
    async getAuthStatus () {
      const { data: { data } } = await this.$axios.get('/googleAuth/status');
      this.googleAuthStatus = data.status;
    },
    async changeAuthStatus (val) {
      const { data } = await this.$axios.post('/googleAuth/status', { status: val });
      this.$message.success(data.message);
    },
    async authTestHandle () {
      const { data: { data } } = await this.$axios.post('/googleAuth/validate', { code: this.googleAuthCode });
      this.authTestStatus = Boolean(data.result);
    },
    // 刷新二维码
    refreshQrCodeHandle () {
      this.$confirm('更换二维码需要重新扫码绑定, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.initData(1);
        this.$message.success('更换成功请重新绑定');
      });
    },
    calculateIcon () {
      return this.authTestStatus ? 'success' : 'error'
    },
    // 引导
    googleAuthGuideHandle () {
      this.$driver.defineSteps(googleAuthGuide);
      this.$driver.start();
    }
  }
}
</script>

<style scoped lang="less">
@import "./../style/googleAuth";
</style>
