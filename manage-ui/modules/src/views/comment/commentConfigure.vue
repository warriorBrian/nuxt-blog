<template>
  <div class="commentConfigure-box">
    <div class="panel">
      <section class="commentConfigure-content">
        <h3 class="item-title no-select">评论状态 <i class="el-icon-question guide" @click="commentConfigureGuideHandle"></i></h3>
        <div class="blacklist-switch-content item-title-content">
          <span class="commentConfigure-switch-text">评论开关</span>
          <el-switch v-model="commentConfigure['comment_status']" class="comment-switch-component" @change="changeCommentStatus($event, 'comment_status')" :active-value="1" :inactive-value="0"></el-switch>
        </div>
      </section>
      <section class="commentConfigure-content">
        <h3 class="item-title no-select">IP记录配置</h3>
        <div class="blacklist-switch-content item-title-content">
          <span class="commentConfigure-switch-text">记录IP开关</span>
          <el-switch v-model="commentConfigure['comment_record_ip']" class="recordIp-switch-component" @change="changeCommentStatus($event, 'comment_record_ip')" :active-value="1" :inactive-value="0"></el-switch>
        </div>
      </section>
      <!--极验配置-->
      <conduct></conduct>
      <!--敏感词管理-->
      <sensitive-manage @files="sensitiveFiles"></sensitive-manage>
      <!--敏感词文本识别-->
      <sensitive-recognition :sensitive-list="sensitiveLists"></sensitive-recognition>
    </div>
  </div>
</template>

<script>
import { success } from '@/plugins/core/lib';
import { configure } from './guide/commentConfigure';
import conduct from "./components/conduct";
import sensitiveManage from "./components/sensitiveManage";
import sensitiveRecognition from "./components/sensitiveRecognition";
export default {
  name: 'commentConfigure',
  components: {
    conduct,
    sensitiveManage,
    sensitiveRecognition
  },
  data () {
    return {
      commentConfigure: {},
      blacklistStatus: 0,
      sensitiveLists: []
    }
  },
  created () {
    this.initialStatus();
  },
  methods: {
    async initialStatus () {
      const { data: { data } } = await this.$axios.get('/comment/status/switch');
      this.commentConfigure = data;
    },
    async changeCommentStatus (status, field) {
      const { data } = await this.$axios.post('/comment/comment-status', { status, field });
      if (success(data.code)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.initialStatus();
      }
    },
    commentConfigureGuideHandle () {
      this.$driver.defineSteps(configure);
      this.$driver.start();
    },
    // 敏感词文件触发
    sensitiveFiles (files) {
      this.sensitiveLists = files;
    }
  }
}
</script>

<style scoped lang="less">
  .is-active {
    background:red;
    &:hover {
      background:red !important;
    }
  }
@import "./style/commentConfigure";
</style>
