<template>
  <div class="system-siteConfig-content">
    <h3 class="item-title no-select">站点元数据配置</h3>
    <section style="width: 360px;">
      <el-form :model="config" status-icon label-position="top" label-width="80px" class="demo-ruleForm">
        <el-form-item label="Title">
          <el-input type="text" size="small" maxlength="255" show-word-limit :disabled="!edit" v-model="config.title" autocomplete="off" :placeholder="placeholder.title"></el-input>
        </el-form-item>
        <el-form-item label="Description">
          <el-input type="text" size="small" maxlength="255" show-word-limit :disabled="!edit" v-model="config.description" autocomplete="off" :placeholder="placeholder.description"></el-input>
        </el-form-item>
        <el-form-item label="Keywords">
          <el-input type="textarea" :rows="3" maxlength="350" show-word-limit size="small" :disabled="!edit" v-model="config.keywords" autocomplete="off" :placeholder="placeholder.keywords"></el-input>
        </el-form-item>
        <el-form-item label="Author">
          <el-input type="text" size="small" maxlength="50" show-word-limit :disabled="!edit" v-model="config.author" autocomplete="off" :placeholder="placeholder.author"></el-input>
        </el-form-item>
        <el-form-item label="站点备案号">
          <el-input type="text" size="small" maxlength="50" show-word-limit :disabled="!edit" v-model="config.record" autocomplete="off" :placeholder="placeholder.record"></el-input>
        </el-form-item>
        <el-form-item class="conduct-btn-group">
          <el-button type="primary" size="small" v-if="!edit" @click="edit = true">编辑</el-button>
          <div v-else>
            <el-button type="primary" size="small" :loading="loading" @click="systemSiteConfigPostHandle()">保存</el-button>
            <el-button size="small" @click="edit = false">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
import { success } from '@/plugins/core/lib';
export default {
  name: 'siteConfig',
  data () {
    return {
      config: {
        title: '',
        description: '',
        keywords: '',
        author: '',
        record: ''
      },
      placeholder: {
        title: '请输入站点标题',
        description: '请输入站点简介',
        keywords: '请输入关键字，以英文逗号分隔，例如: keywords1,keywords2',
        author: '请输入作者名称，同时为底部备案信息作者名称',
        record: '站点备案号'
      },
      edit: false,
      loading: false
    }
  },
  created () {
    this.getSystemSiteConfig();
  },
  methods: {
    async getSystemSiteConfig () {
      const { data: { data } } = await this.$axios.get('/site-config/site');
      this.config = data;
    },
    async systemSiteConfigPostHandle () {
      this.loading = true;
      const { data } = await this.$axios.post('/site-config/site', { ...this.config });
      if (success(data.code)) {
        this.loading = false;
        this.edit = false;
        this.getSystemSiteConfig();
        this.$notify({ title: '成功', message: '保存成功', type: 'success' });
      }
    }
  }
}
</script>

<style scoped lang="less">
.system-siteConfig-content {
  & /deep/ .el-form-item__label {
    padding: 0;
    line-height: 20px;
  }
}
</style>
