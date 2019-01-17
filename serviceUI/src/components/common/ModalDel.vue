<template>
  <div>
    <!--此组件为封闭式组件，除必要外禁止修改-->
    <Modal v-model="modal" width="360" @on-cancel="onCancel">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p style="font-weight: bold;">这个操作将会删除您的数据</p>
        <p style="font-weight: bold;">您确定要这么做？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="del">删除</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  props: {
    status: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      modal_loading: false
    }
  },
  watch: {
    status (val) {
      this.modal = val
    },
    deep: true
  },
  methods: {
    del () {
      this.$emit('update:status', false)
      this.$emit('on-del')
    },
    onCancel () {
      this.$emit('update:status', false)
    }
  }
}
</script>
