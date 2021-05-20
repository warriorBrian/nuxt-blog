<template>
  <div>
    <el-dialog :title="title" :visible.sync="tagsDialogVisible" :close-on-click-modal="false" @close="tagsDialogClose" @open="tagsDialogOpen" width="30%">
      <el-form :model="tagsModel" status-icon :rules="rules" ref="tagsForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="标签名称" prop="name">
          <el-input type="text" size="small" v-model="tagsModel.name" auto-complete="off" :placeholder="placeholder.name"></el-input>
        </el-form-item>
        <el-form-item label="标签简介" prop="introduction">
          <el-input type="textarea" :rows="5" maxlength="255" show-word-limit v-model="tagsModel.introduction" :placeholder="placeholder.introduction"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tagsDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="tagsDialogHandle" size="small">{{btnDisplay}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'tags-dialog',
  props: {
    status: {
      type: Boolean,
      required: true,
      default: false
    },
    dataSource: {
      type: Object
    }
  },
  data () {
    const validateEmpty = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('标签名称不能为空'));
      }
      callback();
    };
    return {
      tagsDialogVisible: false,
      tagsModel: {
        name: '',
        introduction: ''
      },
      rules: {
        name: [
          { validator: validateEmpty, trigger: 'blur', required: true }
        ]
      },
      placeholder: {
        name: '请输入标签名称',
        introduction: '请输入标签简介，标签简介不会展示前台仅作为备注'
      }
    }
  },
  computed: {
    title () {
      const titleMapping = {
        'create': '创建标签',
        'edit': '编辑标签'
      };
      return titleMapping[this.dataSource.type];
    },
    btnDisplay () {
      const btnMapping = {
        'create': '确 定',
        'edit': '保 存'
      };
      return btnMapping[this.dataSource.type];
    }
  },
  watch: {
    // vue 双向数据流
    status: {
      handler (val) {
        this.tagsDialogVisible = val;
      },
      deep: true
    },
    dataSource: {
      handler (val) {
        this.tagsModel = val;
      },
      deep: true
    }
  },
  methods: {
    tagsDialogOpen () {},
    tagsDialogClose () {
      this.$refs['tagsForm'] && this.$refs['tagsForm'].resetFields();
      this.$emit('update:status', false);
    },
    tagsDialogHandle () {
      this.$refs['tagsForm'].validate((valid) => {
        if (valid) {
          this.$emit('success', { ...this.tagsModel, type: this.dataSource.type });
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
