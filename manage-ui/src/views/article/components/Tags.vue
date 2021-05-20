<template>
  <div>
    <el-tag
      v-for="(tags, index) in dynamicTags"
      :key="index"
      closable
      :disable-transitions="false"
      @close="handleClose(tags)">
      {{tags}}
    </el-tag>
    <el-select v-model="tagLists" multiple placeholder="请选择标签" size="small" @visible-change="selectVisibleChange" style="margin-left: 10px;" v-if="inputVisible">
      <el-option
        v-for="(items, index) in tagSelectLists"
        :key="index"
        :label="items.name"
        :value="items.id">
      </el-option>
    </el-select>
    <el-button v-if="inputVisible" type="primary" size="small" class="button-new-tag" @click="addTagHandle">确定</el-button>
    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
  </div>
</template>

<script>
/**
 * @param v-model 双向绑定值
 * @param data 下拉框列表值
 * */
import { debounce } from '@/plugins/core/lib'
export default {
  name: 'Tags',
  props: {
    value: {
      type: Array
    },
    data: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      tagLists: [],
      tagSelectLists: [],
      // tmp 数据
      tmpData: []
    };
  },
  model: {
    prop: 'value', // 绑定的值，通过父组件传递
    event: 'change' // 自定义事件名
  },
  watch: {
    value: {
      handler (val) {
        this.dynamicTags = val.map(v => v.name);
      },
      deep: true,
      immediate: true
    },
    data: {
      handler: debounce(function (val) {
        // 防抖等待dynamicTags被成功赋值
        this.tmpData = val;
        this.tagSelectLists = this.processData(val, k => !this.dynamicTags.includes(k.name));
      }, 800),
      deep: true
    }
  },
  methods: {
    processData (list, fn) {
      return list.map(v => ({ id: v.id, name: v.name })).filter(k => fn(k));
    },
    handleClose (tag) {
      // 删除对应标签
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      // 下拉框中新增删除标签,从远程数据拉取
      const idx = this.value.findIndex(v => v.name === tag);
      this.value.splice(idx, 1);
      this.tagSelectLists = this.processData(this.tmpData, k => !this.dynamicTags.includes(k.name));
    },
    showInput () {
      this.inputVisible = true;
    },
    selectVisibleChange (val) {
      this.$emit('visible-change', val);
    },
    addTagHandle () {
      const list = this.tagLists;
      const filterLists = this.tagSelectLists.filter(v => list.includes(v.id));
      // 赋值v-model数据，由watch处理tag标签
      this.value.push(...filterLists);
      // 隐藏下拉框及确定按钮
      this.inputVisible = false;
      // 下拉列表中排除选择数据
      this.tagSelectLists = this.tagSelectLists.filter(v => !list.includes(v.id));
      // 将下拉框选择数据置空
      this.tagLists = [];
    }
  }
}
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
