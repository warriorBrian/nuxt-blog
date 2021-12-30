<template>
  <div class="post-chain-components" v-if="status">
    <el-divider>提交友链</el-divider>
    <section>
      <el-form :model="postChainModel" status-icon ref="postChain" :rules="rules" label-position="top" label-width="80px" class="post-chain">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="postChainModel.name" size="small" :placeholder="placeholder.name"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="link">
          <el-input v-model="postChainModel.link" size="small" :placeholder="placeholder.link"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="postChainModel.email" size="small" :placeholder="placeholder.email"></el-input>
        </el-form-item>
        <el-form-item label="头像链接" prop="avatarLink">
          <el-input v-model="postChainModel.avatarLink" size="small" :placeholder="placeholder.avatarLink"></el-input>
        </el-form-item>
        <el-form-item class="post-chain-btn">
          <el-button type="info" size="small" @click="postChainSubmitHandle('postChain')">提 交</el-button>
          <el-button size="small" @click="resetForm('postChain')">重 置</el-button>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>
<script>
import { success } from '~/plugins/core/lib'
export default {
  name: 'post-chain',
  data () {
    const validateEmpty = (rule, value, callback) => {
      const keyMap = {
        name: '姓名不能为空',
        link: '链接不能为空',
        email: '邮箱不能为空',
        avatarLink: '头像链接不能为空'
      };
      if (value === '') {
        return callback(new Error(keyMap[ rule['fullField'] ]))
      }
      return callback()
    };
    return {
      postChainModel: {
        name: '',
        link: '',
        email: '',
        avatarLink: ''
      },
      placeholder: {
        name: '请输入姓名',
        link: '请输入链接',
        email: '请输入邮箱，邮箱不会展示在此页面，可用作邮箱通知',
        avatarLink: '请输入头像链接'
      },
      rules: {
        name: [
          { validator: validateEmpty, trigger: 'blur', required: true }
        ],
        link: [
          { validator: validateEmpty, trigger: 'blur', required: true }
        ],
        email: [
          { validator: validateEmpty, trigger: 'blur', required: true }
        ],
        avatarLink: [
          { validator: validateEmpty, trigger: 'blur', required: true }
        ]
      },
      status: 0
    }
  },
  async fetch () {
    await this.getChainStatusHandle();
  },
  methods: {
    async getChainStatusHandle () {
      const { data: { data } } = await this.$axios.get('/chain/status');
      this.status = data.status;
    },
    // 提交友链
    async postChainHandle () {
      const { data } = await this.$axios.post('/chain', { ...this.postChainModel });
      if (success(data.code)) {
        this.$notify({ title: '成功', message: '感谢您提交友链，友链进入审核环节请耐心等待，非常感谢您的支持!', type: 'success' });
        this.resetForm('postChain');
      }
    },
    postChainSubmitHandle (formName) {
      this.$refs[formName].validate((valid) => {
        valid && this.postChainHandle();
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>
<style lang="less" scoped>
.post-chain-components {
  width: 100%;
  margin-top: 10rem;
}
.post-chain {
  & /deep/ .el-form-item__label {
    padding: 0;
  }
}
.post-chain-btn {
  display: flex;
  justify-content: flex-end;
  margin: 2rem 0;
}
</style>
