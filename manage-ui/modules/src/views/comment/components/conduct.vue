<template>
  <div>
    <h3 class="item-title no-select">极验行为验证配置</h3>
    <section style="width: 360px;">
      <el-alert v-if="alert" title="极验ID及KEY为空，可能导致在评论时无法使用行为验证" type="warning"></el-alert>
      <el-form :model="secret" status-icon ref="conductForm" label-width="30px" class="demo-ruleForm">
        <el-form-item label="id" prop="pass">
          <el-input :type="!edit ? 'password' : 'text'" class="no-autofill-pwd conduct-geetest-id" size="small" :disabled="!edit" v-model="secret.geetest_id" autocomplete="off" :placeholder="placeholder.geetest_id"></el-input>
        </el-form-item>
        <el-form-item label="key" prop="checkPass">
          <el-input :type="!edit ? 'password' : 'text'" class="no-autofill-pwd" size="small" :disabled="!edit" v-model="secret.geetest_key" autocomplete="off" :placeholder="placeholder.geetest_key"></el-input>
        </el-form-item>
        <el-form-item class="conduct-btn-group">
          <el-button type="primary" size="small" v-if="!edit" @click="edit = true">编辑</el-button>
          <div v-else>
            <el-button type="primary" size="small" :loading="loading" @click="conductSecretPostHandle('conductForm')">提交</el-button>
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
  name: 'conduct',
  data () {
    return {
      secret: {
        geetest_id: '',
        geetest_key: ''
      },
      placeholder: {
        geetest_id: '请输入极验id',
        geetest_key: '请输入极验key'
      },
      edit: false,
      loading: false,
      alert: false
    }
  },
  created () {
    this.getConductSecretKey();
  },
  methods: {
    async getConductSecretKey () {
      const { data: { data } } = await this.$axios.get('/geetest');
      this.alert = Object.keys(data).some(v => data[v].length === 0);
      this.secret = data;
    },
    async conductSecretPostHandle () {
      this.loading = true;
      const { data } = await this.$axios.post('/geetest', { ...this.secret });
      if (success(data.code)) {
        this.loading = false;
        this.edit = false;
        this.getConductSecretKey();
        this.$notify({ title: '成功', message: '保存成功', type: 'success' });
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
