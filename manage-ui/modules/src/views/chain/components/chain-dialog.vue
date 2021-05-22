<template>
  <div>
    <el-dialog title="审核友链" :visible.sync="chainDialogVisible" :close-on-click-modal="false" @close="chainDialogClose" @open="chainDialogOpen" width="30%">
      <el-form :model="chainFormParams" status-icon ref="ruleForm" label-width="80px" class="demo-ruleForm">
        <!-- 提示性警告 -->
        <el-alert title="提示" type="warning" :closable="false" show-icon style="margin-bottom: 10px;">
          <template name="description">
            <span>任何链接都有可能存在潜在的不安全因素，包括钓鱼、恶意链接等，为避免请尽量在沙箱环境中打开链接或注意分辨链接真伪性!</span>
            <p>( 要警惕不明的链接、广告和弹出的窗口, 无论它们何种形式出现，都不要进行点击，尽量避免下载来源不明的程序和附件 )</p>
          </template>
        </el-alert>
        <el-form-item label="链接地址">
          {{ chainFormParams.link || '暂无' }}
        </el-form-item>
        <el-form-item label="图片链接">
          {{ chainFormParams.avatarLink || '暂无' }}
        </el-form-item>
        <el-form-item label="审核状态">
          <el-radio-group v-model="chainFormParams.status">
            <el-radio :label="0">待审核</el-radio>
            <el-radio :label="1">审核通过</el-radio>
            <el-radio :label="2">审核拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 审核拒绝展示 -->
        <el-form-item label="审核建议" v-if="chainFormParams.status === 2">
          <el-input type="textarea" :rows="4" v-model="chainFormParams.suggest" maxlength="254" show-word-limit :placeholder="placeholder.suggest"></el-input>
        </el-form-item>
        <el-form-item label="邮箱推送">
          <el-checkbox v-model="chainFormParams.pushEmail"></el-checkbox>
          <span class="chain-form-desc">( 勾选时将推送审核结果至提交链接邮箱 )</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chainDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="chainDialogHandle" size="small" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { success } from '@/plugins/core/lib';
export default {
  name: 'chain-dialog.vue',
  props: {
    status: {
      type: Boolean,
      required: true,
      default: false
    },
    params: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      chainDialogVisible: false,
      chainFormParams: {
        link: '',
        avatarLink: '',
        email: '',
        status: 0,
        suggest: '',
        pushEmail: false
      },
      placeholder: {
        suggest: '请输入审核拒绝建议'
      },
      loading: false
    }
  },
  watch: {
    // vue 双向数据流
    status: {
      handler (val) {
        this.chainDialogVisible = val;
      },
      deep: true
    },
    params: {
      handler (val) {
        this.chainFormParams = Object.assign({}, this.chainFormParams, { ...val, pushEmail: val.pushEmail || false });
      },
      deep: true
    }
  },
  methods: {
    // 确定触发
    async chainDialogHandle () {
      this.loading = true;
      const { id, status, suggest, email, pushEmail } = this.chainFormParams;
      try {
        const { data } = await this.$axios.post('/chain/audit', { id, status, suggest, email, pushEmail });
        if (success(data.code)) {
          this.$notify({ title: '成功', message: data.message, type: 'success' });
          this.$emit('success');
          this.loading = false;
          this.chainDialogVisible = false;
        }
      } catch (e) {
        this.loading = false;
      }
    },
    // open
    chainDialogOpen () {
      this.$emit('open');
    },
    // close
    chainDialogClose () {
      this.$emit('update:status', false);
    }
  }
}
</script>

<style scoped lang="less">
.chain-form-desc {
  margin-left: 10px;
  font-size: 12px;
  color: #8c8c8c;
}
</style>
