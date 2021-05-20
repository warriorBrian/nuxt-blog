<template>
  <div>
    <el-dialog title="添加访问黑名单" :visible.sync="addBlacklistVisible" :close-on-click-modal="false" @close="addBlacklistDialogClose" @open="addBlacklistDialogOpen" width="30%">
      <el-form :model="addBlacklistModel" status-icon :rules="rules" ref="addBlacklistForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="受限IP地址" prop="ip">
          <el-input type="text" size="small" v-model="addBlacklistModel.ip" auto-complete="off" :placeholder="placeholder.ip"></el-input>
        </el-form-item>
        <el-form-item label="过期时间" prop="exp">
          <el-date-picker
            class="blacklist-date-picker"
            v-model="addBlacklistModel.exp"
            type="datetime"
            size="small"
            value-format="timestamp"
            @change="datePickerChangeHandle"
            :picker-options="pickerOptions"
            :placeholder="placeholder.exp">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addBlacklistVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="addBlacklistDialogHandle" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { validateFormat } from '@/plugins/core/lib';
export default {
  name: 'addBlacklistDialog',
  props: {
    status: {
      type: Boolean,
      required: true,
      default: false
    },
  },
  data () {
    const validateIp = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('IP地址不能为空'));
      }
      if (!validateFormat(value, ['ipv4', 'ipv4segment'])) {
        return callback(new Error('IP地址不符合规范'));
      }
      callback();
    };
    const validateDate = (rule, value, callback) => {
      if (value === '' || value == null) {
        return callback(new Error('过期时间不能为空'));
      }
      callback();
    };
    return {
      addBlacklistVisible: false,
      placeholder: {
        ip: '请输入IP地址',
        exp: '请选择过期时间'
      },
      addBlacklistModel: {
        ip: '',
        exp: ''
      },
      rules: {
        ip: [
          { validator: validateIp, trigger: 'blur' }
        ],
        exp: [
          { validator: validateDate, trigger: 'blur' }
        ]
      },
      conversionTimestamp: null,
      pickerOptions: {
        disabledDate (time) {
          // 当天23:59:59
          const nowTime = new Date(new Date().toLocaleDateString()).getTime() - (24 * 60 * 60 * 1000 - 1);
          return time.getTime() < Number(nowTime);
        },
        shortcuts: [
          {
            text: '十分钟',
            onClick (picker) {
              const date = new Date();
              date.setTime(date.getTime() + 600 * 1000);
              picker.$emit('pick', date);
            }
          },
          {
            text: '半小时',
            onClick (picker) {
              const date = new Date();
              date.setTime(date.getTime() + 1800 * 1000);
              picker.$emit('pick', date);
            }
          },
          {
            text: '一个小时',
            onClick (picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000);
              picker.$emit('pick', date);
            }
          },
          {
            text: '明天此刻',
            onClick (picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          },
          {
            text: '未来三天',
            onClick (picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 3);
              picker.$emit('pick', date);
            }
          },
          {
            text: '未来七天',
            onClick (picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          },
          {
            text: '未来三十天',
            onClick (picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', date);
            }
          },
          {
            text: '未来一年',
            onClick (picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 365);
              picker.$emit('pick', date);
            }
          }
        ]
      }
    }
  },
  watch: {
    // vue 双向数据流
    status: {
      handler (val) {
        this.addBlacklistVisible = val;
      },
      deep: true
    }
  },
  methods: {
    // dialog open event
    addBlacklistDialogOpen () {
      this.$refs['addBlacklistForm'] && this.$refs['addBlacklistForm'].resetFields();
    },
    // dialog close event
    addBlacklistDialogClose () {
      this.$emit('update:status', false);
    },
    datePickerChangeHandle (timestamp) {
      if (timestamp) {
        this.conversionTimestamp = Number(Math.round(timestamp / 1000))
      }
    },
    // add blacklist handle
    addBlacklistDialogHandle () {
      this.$refs['addBlacklistForm'].validate((valid) => {
        if (valid) {
          const value = Object.assign({}, this.addBlacklistModel, { exp: this.conversionTimestamp });
          this.$emit('success', value);
        }
      });
    }
  }
}
</script>

<style scoped lang="less">
.blacklist-date-picker {
  width: 100%;
}
</style>
