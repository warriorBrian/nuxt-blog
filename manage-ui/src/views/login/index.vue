<template>
  <div class="dashBoard-login-content">
    <div class="dashBoard-login-container">
      <div class="dashBoard-login-card">
        <!--dashBoard logo-->
        <div class="dashBoard-login-logo"></div>
        <!--dashBoard 登录表单-->
        <div class="dashBoard-login-form">
          <el-form :model="dashBoardLoginConfig" status-icon :rules="logoRules" ref="loginRulesForm" class="demo-ruleForm">
            <el-form-item prop="username">
              <el-input type="text" v-model="dashBoardLoginConfig.username" autocomplete="off" :placeholder="showPlaceholder('username')"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="dashBoardLoginConfig.password" autocomplete="off" :placeholder="showPlaceholder('password')"></el-input>
            </el-form-item>
            <el-form-item prop="code" v-if="Boolean(googleCodeStatus)">
              <el-input type="text" v-model="dashBoardLoginConfig.code" autocomplete="off" :placeholder="showPlaceholder('code')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="dashBoard-login-btn" @click="loginHandle('ruleForm')">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LocalStorage from '../../plugins/core/lib/local';
import SessionStorage from "../../plugins/core/lib/session";
const local = new LocalStorage();
const session = new SessionStorage();
export default {
  name: 'index',
  data () {
    const validatePass = (rule, value, callback) => {
      const emptyMapping = {
        username: '用户名不能为空',
        password: '密码不能为空',
        code: '谷歌验证code不能为空'
      };
      if (!value) {
        return callback(new Error(emptyMapping[rule['field']]));
      } else {
        callback();
      }
    };
    return {
      dashBoardLoginConfig: {
        username: '',
        password: '',
        code: ''
      },
      logoRules: {
        username: [
          { validator: validatePass, trigger: 'change', required: true }
        ],
        password: [
          { validator: validatePass, trigger: 'change', required: true }
        ],
        code: [
          { validator: validatePass, trigger: 'change' }
        ]
      },
      // 谷歌code显示
      googleCodeStatus: 0
    }
  },
  created () {
    this.getGoogleAuthStatus();
  },
  methods: {
    async getGoogleAuthStatus () {
      const { data: { data } } = await this.$axios.get('/googleAuth/status');
      this.googleCodeStatus = data.status;
    },
    async loginHandle () {
      this.$refs['loginRulesForm'].validate(async (valid) => {
        if (valid) {
          const { data: { data, code } } = await this.$axios.post('/login', this.dashBoardLoginConfig);
          if (Object.is(code, 200)) {
            const { token } = data;
            session.setItem('access_token', token);
            session.setItem('user_info', data);
            this.$router.push({ name: 'overview' });
          }
        } else {
          return false;
        }
      });
    },
    showPlaceholder (value) {
      const placeHolder = {
        username: '请输入用户名',
        password: '请输入密码',
        code: '请输入谷歌验证器code'
      };
      return placeHolder[value]
    }
  }
}
</script>

<style scoped lang="less">
@import "./style/index.less";
</style>
