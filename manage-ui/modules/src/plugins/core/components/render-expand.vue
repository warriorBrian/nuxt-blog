<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'render-expand',
  props: {
    render: {
      type: Object,
      required: true
    }
  },
  created () {
    // 将vnode赋值给slot渲染
    this.$slots.default = this.render;
  }
}
</script>

<style scoped>

</style>
