<template>
  <div>
    <el-dialog title="修改密码" :visible.sync="modifyPwdVisible" :close-on-click-modal="false" @close="modifyPwdDialogClose" @open="modifyPwdDialogOpen" width="30%">
      <el-form :model="modifyPwdModel" status-icon :rules="rules" ref="modifyForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="原密码" prop="old_password">
          <el-input type="password" size="small" v-model="modifyPwdModel.old_password" autocomplete="off" :placeholder="placeholder.old_password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="new_password">
          <el-input type="text" size="small" class="no-autofill-pwd" v-model="modifyPwdModel.new_password" autocomplete="off" :placeholder="placeholder.new_password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="check_pass">
          <el-input type="text" size="small" class="no-autofill-pwd" v-model="modifyPwdModel.check_pass" autocomplete="off" :placeholder="placeholder.check_pass"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyPwdVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="modifyPasswordHandle" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { omit } from "../../../plugins/core/lib";
export default {
  name: 'modifyPwdDialog',
  props: {
    status: {
      type: Boolean,
      required: true,
      default: false
    },
    data: {
      type: Object,
      required: true
    }
  },
  watch: {
    // vue 双向数据流
    status: {
      handler (val) {
        this.modifyPwdVisible = val;
      },
      deep: true
    }
  },
  data () {
    const validatePwdHandle = (rule, value, callback) => {
      const mappingError = {
        old_password: '原密码不能为空',
        new_password: '新密码不能为空'
      };
      if (value === '') {
        return callback(new Error(mappingError[rule['field']]));
      }
      callback();
    };
    const validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.modifyPwdModel.new_password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      placeholder: {
        old_password: '请输入原密码',
        new_password: '请输入新密码',
        check_pass: '再次输入新密码'
      },
      modifyPwdVisible: false,
      modifyPwdModel: {
        old_password: '',
        new_password: '',
        check_pass: ''
      },
      rules: {
        old_password: [
          { validator: validatePwdHandle, trigger: 'blur' }
        ],
        new_password: [
          { validator: validatePwdHandle, trigger: 'blur' }
        ],
        check_pass: [
          { validator: validateCheckPass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    modifyPwdDialogOpen () {
      this.$refs['modifyForm'] && this.$refs['modifyForm'].resetFields();
    },
    modifyPwdDialogClose () {
      this.$emit('update:status', false);
    },
    // modify password
    modifyPasswordHandle () {
      this.$refs['modifyForm'].validate((valid) => {
        if (valid) {
          this.$emit('success', omit(this.modifyPwdModel, ['check_pass']));
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
