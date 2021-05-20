<template>
  <div>
    <el-dialog title="添加用户" :visible.sync="addUserVisible" :close-on-click-modal="false" @close="addUserDialogClose" @open="addUserDialogOpen" width="30%">
      <el-form :model="addUserModel" status-icon :rules="rules" ref="addUserForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" size="small" v-model="addUserModel.username" auto-complete="off" :placeholder="placeholder.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="text" size="small" class="no-autofill-pwd" v-model="addUserModel.password" autocomplete="off" :placeholder="placeholder.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="check_pass">
          <el-input type="text" size="small" class="no-autofill-pwd" v-model="addUserModel.check_pass" auto-complete="off" :placeholder="placeholder.check_pass"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="addUserDialogHandle" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { omit } from "../../../plugins/core/lib";
export default {
  name: 'addUserDialog',
  props: {
    status: {
      type: Boolean,
      required: true,
      default: false
    },
  },
  data () {
    const validateEmpty = (rule, value, callback) => {
      const mappingError = {
        username: '用户名不能为空',
        password: '密码不能为空'
      };
      if (value === '') {
        return callback(new Error(mappingError[rule['field']]));
      }
      callback();
    };
    const validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.addUserModel.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      addUserVisible: false,
      placeholder: {
        username: '请输入用户名',
        password: '请输入密码',
        check_pass: '请输入确认密码'
      },
      addUserModel: {
        username: '',
        password: '',
        check_pass: ''
      },
      rules: {
        username: [
          { validator: validateEmpty, trigger: 'blur' }
        ],
        password: [
          { validator: validateEmpty, trigger: 'blur' }
        ],
        check_pass: [
          { validator: validateCheckPass, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    // vue 双向数据流
    status: {
      handler (val) {
        this.addUserVisible = val;
      },
      deep: true
    }
  },
  methods: {
    // dialog open event
    addUserDialogOpen () {
      this.$refs['addUserForm'] && this.$refs['addUserForm'].resetFields();
    },
    // dialog close event
    addUserDialogClose () {
      this.$emit('update:status', false);
    },
    // add user handle
    addUserDialogHandle () {
      this.$refs['addUserForm'].validate((valid) => {
        if (valid) {
          // 忽略check_pass字段，不传递给后端
          this.$emit('success', omit(this.addUserModel, ['check_pass']));
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
