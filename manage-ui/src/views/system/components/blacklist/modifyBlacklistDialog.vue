<template>
  <div>
    <el-dialog title="修改访问黑名单" :visible.sync="modifyBlacklistVisible" :close-on-click-modal="false" @close="modifyBlacklistDialogClose" @open="modifyBlacklistDialogOpen" width="30%">
      <el-form :model="modifyBlacklistModel" status-icon :rules="rules" ref="modifyBlacklistForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="过期时间" prop="exp">
          <el-date-picker
            class="blacklist-date-picker"
            v-model="modifyBlacklistModel.exp"
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
        <el-button @click="modifyBlacklistVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="modifyBlacklistDialogHandle" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'modifyBlacklistDialog',
  props: {
    status: {
      type: Boolean,
      required: true,
      default: false
    },
    data: {}
  },
  data () {
    const validateDate = (rule, value, callback) => {
      if (value === '' || value == null) {
        return callback(new Error('过期时间不能为空'));
      }
      callback();
    };
    return {
      modifyBlacklistVisible: false,
      placeholder: {
        exp: '请选择过期时间'
      },
      modifyBlacklistModel: {
        exp: ''
      },
      rules: {
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
      },
      changeData: null
    }
  },
  watch: {
    // vue 双向数据流
    status: {
      handler (val) {
        this.modifyBlacklistVisible = val;
      },
      deep: true
    },
    data: {
      handler (val) {
        this.$set(this.modifyBlacklistModel, 'exp', Number(Math.round(val.exp * 1000)));
        this.changeData = val;
      },
      deep: true
    }
  },
  methods: {
    // dialog open event
    modifyBlacklistDialogOpen () {
      // this.$refs['modifyBlacklistForm'] && this.$refs['modifyBlacklistForm'].resetFields();
    },
    // dialog close event
    modifyBlacklistDialogClose () {
      this.$emit('update:status', false);
    },
    datePickerChangeHandle (timestamp) {
      if (timestamp) {
        this.conversionTimestamp = Number(Math.round(timestamp / 1000))
      }
    },
    // add blacklist handle
    modifyBlacklistDialogHandle () {
      this.$refs['modifyBlacklistForm'].validate((valid) => {
        if (valid) {
          const value = Object.assign({}, this.addBlacklistModel, { exp: this.conversionTimestamp, id: this.changeData.id });
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
