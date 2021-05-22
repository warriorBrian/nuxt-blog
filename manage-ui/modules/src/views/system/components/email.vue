<template>
  <div class="panel">
    <h3 class="item-title no-select">邮箱配置</h3>
    <!-- email config -->
    <el-form :model="emailConfig" status-icon ref="emailForm" label-width="80px" class="emailForm">
      <el-form-item label="host" prop="pass">
        <span v-if="!edit">{{ emailConfig.host }}</span>
        <el-input v-else type="text" size="small" v-model="emailConfig.host" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="port" prop="pass">
        <span v-if="!edit">{{ emailConfig.port }}</span>
        <el-input v-else type="text" size="small" v-model="emailConfig.port" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="SSL">
        <span v-if="!edit">{{ emailConfig.secure }}</span>
        <el-checkbox v-else v-model="emailConfig.secure"></el-checkbox>
      </el-form-item>
      <el-form-item label="用户名" prop="pass">
        <span v-if="!edit">{{ emailConfig.auth.user }}</span>
        <el-input v-else type="text" size="small" v-model="emailConfig.auth.user" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="授权码" prop="pass">
        <span v-if="!edit">{{ emailConfig.auth.pass }}</span>
        <el-input v-else type="text" size="small" v-model="tmpPass" autocomplete="off" :placeholder="placeholder.pass"></el-input>
      </el-form-item>
      <div style="margin-left: 25px;">
        <el-button size="small" v-if="edit" @click="cancelEditEmailHandle('emailForm')">取 消</el-button>
        <el-button v-if="!edit" type="default" size="small" @click="edit = true">编  辑</el-button>
        <el-button v-else type="primary" size="small" @click="saveEmailConfigHandle">保 存</el-button>
        <el-button type="default" v-if="!edit" size="small" @click="sendTestEmailHandle">发送测试邮件</el-button>
      </div>
    </el-form>
    <!-- email dialog -->
    <el-dialog title="发送测试邮件" :visible.sync="sendTestEmailVisible" @open="sendTestEmailDialogOpen" :close-on-click-modal="false" width="25%">
      <el-form :model="sendTestEmailModel" status-icon ref="addBlacklistForm" label-width="90px" class="demo-ruleForm">
        <el-form-item label="发件人地址" prop="ip">
          <el-input type="text" size="small" v-model="sendTestEmailModel.from" auto-complete="off" :placeholder="sendTestPlaceholder.from"></el-input>
        </el-form-item>
        <el-form-item label="收件人" prop="ip">
          <el-input type="text" size="small" v-model="sendTestEmailModel.to" auto-complete="off" :placeholder="sendTestPlaceholder.to"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sendTestEmailVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="sendTestEmail" :loading="sendLoading">发 送</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { success } from '@/plugins/core/lib';
export default {
  name: 'email',
  data () {
    return {
      emailConfig: {
        host: '',
        port: '',
        secure: true,
        auth: {
          user: '',
          pass: ''
        }
      },
      tmpPass: '',
      edit: false,
      placeholder: {
        host: '发送服务器',
        port: '根据邮箱配置不同，端口不同',
        user: '用户名为邮箱地址',
        pass: '授权码为一次性授权码，不会回显真实授权码'
      },
      sendTestEmailVisible: false,
      sendTestEmailModel: {
        from: '',
        to: ''
      },
      sendTestPlaceholder: {
        from: '发件人的电子邮件地址',
        to: '收件人地址, 多个收件人以英文逗号分割'
      },
      sendLoading: false
    }
  },
  created () {
    this.getEmailConfigHandle();
  },
  methods: {
    // 获取邮件配置
    async getEmailConfigHandle () {
      const { data: { data } } = await this.$axios.get('/email');
      this.emailConfig = Object.assign({}, this.emailConfig, data['configs']);
    },
    // 取消
    cancelEditEmailHandle (formName) {
      this.$refs[formName].resetFields();
      this.tmpPass = '';
      this.getEmailConfigHandle();
      this.edit = false;
    },
    // 保存
    async saveEmailConfigHandle () {
      // 重新组合，防止组合脱敏密码
      const auth = { user: this.emailConfig.auth.user, pass: this.tmpPass };
      const params = Object.assign({}, this.emailConfig, { auth: { ...auth } });
      const { data } = await this.$axios.post('/email', { ...params });
      if (success(data.code)) {
        this.$notify({ title: '成功', message: data.message, type: 'success' });
        this.edit = false;
        this.getEmailConfigHandle();
      }
    },
    // 点击发送测试邮件触发
    sendTestEmailHandle () {
      this.sendTestEmailVisible = true;
    },
    // 发送测试邮件dialog open
    sendTestEmailDialogOpen () {
      this.sendTestEmailModel.from = this.emailConfig.auth.user;
    },
    // 发送测试邮件
    async sendTestEmail () {
      this.sendLoading = true;
      try {
        const { data } = await this.$axios.post('/email/test', { ...this.sendTestEmailModel });
        if (success(data.code)) {
          this.$notify({ title: '成功', message: data.message, type: 'success' });
          this.sendTestEmailVisible = false;
          this.sendLoading = false;
        }
      } catch (e) {
        this.sendLoading = false;
      }
    }
  }
}
</script>

<style scoped lang="less">
.emailForm {
  width: 400px;
}
</style>
