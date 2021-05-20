<template>
  <div class="empty-context">
    <i class="icon-empty-data" :style="{width: `${width || '300'}px`, backgroundSize: `${width || '300'}px`, height: `${width || '300'}px`}"></i>
    <div class="empty-text">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'empty-data',
  props: ['width']
}
</script>

<style scoped lang="less">
.empty-context {
  display:flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.icon-empty-data {
  background-image: url("./../../assets/empty-color.svg");
  background-repeat: no-repeat;
  display:block;
}
.empty-text {
  color:#cdd2d9;
  text-align: center;
  line-height: 30px;
}
</style>
